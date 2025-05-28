export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const monitorId = searchParams.get('monitorId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    
    if (monitorId) {
      where.monitorId = monitorId
    }
    
    if (startDate && endDate) {
      where.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const [vitalSigns, total] = await Promise.all([
      prisma.vitalSign.findMany({
        where,
        include: {
          monitor: true
        },
        orderBy: { timestamp: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.vitalSign.count({ where })
    ])

    return NextResponse.json({
      data: vitalSigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching history:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}