export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Get overall statistics
    const [
      totalMonitors,
      activeMonitors,
      totalVitalSigns,
      totalAlarms,
      activeAlarms,
      criticalAlarms,
      avgEWS,
      avgMEWS,
      avgSepsisRisk,
      avgSuddenDeathRisk
    ] = await Promise.all([
      prisma.monitor.count(),
      prisma.monitor.count({ where: { isActive: true } }),
      prisma.vitalSign.count(),
      prisma.alarm.count(),
      prisma.alarm.count({ where: { isActive: true } }),
      prisma.alarm.count({ where: { isActive: true, severity: 'CRITICAL' } }),
      prisma.vitalSign.aggregate({ _avg: { ewsScore: true } }),
      prisma.vitalSign.aggregate({ _avg: { mewsScore: true } }),
      prisma.vitalSign.aggregate({ _avg: { sepsisRisk: true } }),
      prisma.vitalSign.aggregate({ _avg: { suddenDeathRisk: true } })
    ])

    // Get recent vital signs for trends
    const recentVitalSigns = await prisma.vitalSign.findMany({
      take: 100,
      orderBy: { timestamp: 'desc' },
      include: {
        monitor: {
          select: {
            name: true,
            location: true
          }
        }
      }
    })

    // Get alarm distribution by type
    const alarmsByType = await prisma.alarm.groupBy({
      by: ['type'],
      where: { isActive: true },
      _count: {
        id: true
      }
    })

    // Get alarm distribution by severity
    const alarmsBySeverity = await prisma.alarm.groupBy({
      by: ['severity'],
      where: { isActive: true },
      _count: {
        id: true
      }
    })

    // Calculate trends (last 24 hours)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const vitalSignsTrend = await prisma.vitalSign.findMany({
      where: {
        timestamp: {
          gte: last24Hours
        }
      },
      orderBy: { timestamp: 'asc' },
      select: {
        heartRate: true,
        bloodPressureSys: true,
        bloodPressureDia: true,
        temperature: true,
        oxygenSaturation: true,
        respiratoryRate: true,
        ewsScore: true,
        mewsScore: true,
        sepsisRisk: true,
        suddenDeathRisk: true,
        timestamp: true
      }
    })

    const statistics = {
      overview: {
        totalMonitors,
        activeMonitors,
        totalVitalSigns,
        totalAlarms,
        activeAlarms,
        criticalAlarms
      },
      averages: {
        ewsScore: avgEWS._avg.ewsScore || 0,
        mewsScore: avgMEWS._avg.mewsScore || 0,
        sepsisRisk: (avgSepsisRisk._avg.sepsisRisk || 0) * 100,
        suddenDeathRisk: (avgSuddenDeathRisk._avg.suddenDeathRisk || 0) * 100
      },
      alarms: {
        byType: alarmsByType,
        bySeverity: alarmsBySeverity
      },
      trends: {
        last24Hours: vitalSignsTrend
      },
      recentVitalSigns: recentVitalSigns.slice(0, 20)
    }

    return NextResponse.json(statistics)
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
  }
}