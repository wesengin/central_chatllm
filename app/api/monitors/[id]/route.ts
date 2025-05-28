export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const monitor = await prisma.monitor.findUnique({
      where: { id: params.id },
      include: {
        vitalSigns: {
          orderBy: { timestamp: 'desc' },
          take: 100 // Get last 100 readings for charts
        },
        alarms: {
          orderBy: { timestamp: 'desc' },
          take: 50
        }
      }
    })

    if (!monitor) {
      return NextResponse.json({ error: 'Monitor not found' }, { status: 404 })
    }

    return NextResponse.json(monitor)
  } catch (error) {
    console.error('Error fetching monitor:', error)
    return NextResponse.json({ error: 'Failed to fetch monitor' }, { status: 500 })
  }
}