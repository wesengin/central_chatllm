export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.alarm.updateMany({
      where: {
        monitorId: params.id,
        isActive: true
      },
      data: {
        isMuted: true
      }
    })

    return NextResponse.json({ message: 'Alarms muted successfully' })
  } catch (error) {
    console.error('Error muting alarms:', error)
    return NextResponse.json({ error: 'Failed to mute alarms' }, { status: 500 })
  }
}