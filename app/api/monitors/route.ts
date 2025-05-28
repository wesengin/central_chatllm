export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateRandomVitalSigns, calculateEWS, calculateMEWS } from '@/lib/utils'

export async function GET() {
  try {
    const monitors = await prisma.monitor.findMany({
      include: {
        vitalSigns: {
          orderBy: { timestamp: 'desc' },
          take: 1
        },
        alarms: {
          where: { isActive: true },
          orderBy: { timestamp: 'desc' }
        }
      }
    })

    return NextResponse.json(monitors)
  } catch (error) {
    console.error('Error fetching monitors:', error)
    return NextResponse.json({ error: 'Failed to fetch monitors' }, { status: 500 })
  }
}

export async function POST() {
  try {
    // Create 16 monitors if they don't exist
    const existingMonitors = await prisma.monitor.count()
    
    if (existingMonitors === 0) {
      const monitorsData = Array.from({ length: 16 }, (_, i) => ({
        name: `Monitor ${String(i + 1).padStart(2, '0')}`,
        location: `Leito ${String(i + 1).padStart(2, '0')} - UTI`,
        patientName: `Paciente ${String(i + 1).padStart(2, '0')}`,
        patientAge: 25 + Math.floor(Math.random() * 50)
      }))

      const monitors = await Promise.all(
        monitorsData.map(data => prisma.monitor.create({ data }))
      )

      // Generate initial vital signs for each monitor
      for (const monitor of monitors) {
        const vitalSigns = generateRandomVitalSigns()
        const ewsScore = calculateEWS(vitalSigns)
        const mewsScore = calculateMEWS(vitalSigns)
        
        await prisma.vitalSign.create({
          data: {
            monitorId: monitor.id,
            ...vitalSigns,
            ewsScore,
            mewsScore,
            sepsisRisk: Math.random() * 0.3, // Low risk by default
            suddenDeathRisk: Math.random() * 0.2 // Low risk by default
          }
        })

        // Generate some alarms for demonstration
        if (Math.random() > 0.7) {
          await prisma.alarm.create({
            data: {
              monitorId: monitor.id,
              type: 'VITAL_SIGN',
              severity: ewsScore >= 7 ? 'CRITICAL' : ewsScore >= 5 ? 'HIGH' : 'MEDIUM',
              message: ewsScore >= 7 ? 'EWS Crítico - Intervenção Imediata' : 
                      ewsScore >= 5 ? 'EWS Alto - Avaliação Urgente' : 
                      'Sinais Vitais Alterados'
            }
          })
        }
      }

      return NextResponse.json({ message: 'Monitors created successfully' })
    }

    return NextResponse.json({ message: 'Monitors already exist' })
  } catch (error) {
    console.error('Error creating monitors:', error)
    return NextResponse.json({ error: 'Failed to create monitors' }, { status: 500 })
  }
}