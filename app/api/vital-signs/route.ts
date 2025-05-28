export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateRandomVitalSigns, calculateEWS, calculateMEWS } from '@/lib/utils'

export async function POST() {
  try {
    const monitors = await prisma.monitor.findMany()
    
    // Generate new vital signs for all monitors
    for (const monitor of monitors) {
      const vitalSigns = generateRandomVitalSigns()
      const ewsScore = calculateEWS(vitalSigns)
      const mewsScore = calculateMEWS(vitalSigns)
      
      // Simulate AI risk assessment
      let sepsisRisk = Math.random() * 0.3
      let suddenDeathRisk = Math.random() * 0.2
      
      // Increase risk based on vital signs
      if (ewsScore >= 7) {
        sepsisRisk = Math.min(0.9, sepsisRisk + 0.4)
        suddenDeathRisk = Math.min(0.8, suddenDeathRisk + 0.3)
      } else if (ewsScore >= 5) {
        sepsisRisk = Math.min(0.7, sepsisRisk + 0.2)
        suddenDeathRisk = Math.min(0.6, suddenDeathRisk + 0.2)
      }
      
      await prisma.vitalSign.create({
        data: {
          monitorId: monitor.id,
          ...vitalSigns,
          ewsScore,
          mewsScore,
          sepsisRisk,
          suddenDeathRisk
        }
      })

      // Generate alarms based on scores and risks
      if (ewsScore >= 7 || sepsisRisk >= 0.8 || suddenDeathRisk >= 0.7) {
        await prisma.alarm.create({
          data: {
            monitorId: monitor.id,
            type: sepsisRisk >= 0.8 ? 'SEPSIS_RISK' : 
                  suddenDeathRisk >= 0.7 ? 'SUDDEN_DEATH_RISK' : 'EWS_HIGH',
            severity: 'CRITICAL',
            message: sepsisRisk >= 0.8 ? 'Alto Risco de Sepse - Intervenção Imediata' :
                    suddenDeathRisk >= 0.7 ? 'Alto Risco de Morte Súbita - Emergência' :
                    'EWS Crítico - Avaliação Imediata'
          }
        })
      } else if (ewsScore >= 5 || sepsisRisk >= 0.5 || suddenDeathRisk >= 0.4) {
        await prisma.alarm.create({
          data: {
            monitorId: monitor.id,
            type: sepsisRisk >= 0.5 ? 'SEPSIS_RISK' : 
                  suddenDeathRisk >= 0.4 ? 'SUDDEN_DEATH_RISK' : 'EWS_HIGH',
            severity: 'HIGH',
            message: sepsisRisk >= 0.5 ? 'Risco Moderado de Sepse - Monitoramento Intensivo' :
                    suddenDeathRisk >= 0.4 ? 'Risco de Morte Súbita - Atenção Especial' :
                    'EWS Elevado - Avaliação Necessária'
          }
        })
      }
    }

    return NextResponse.json({ message: 'Vital signs updated successfully' })
  } catch (error) {
    console.error('Error updating vital signs:', error)
    return NextResponse.json({ error: 'Failed to update vital signs' }, { status: 500 })
  }
}