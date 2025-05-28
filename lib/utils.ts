import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateECGData(points: number = 100): number[] {
  const data: number[] = []
  for (let i = 0; i < points; i++) {
    const t = (i / points) * 4 * Math.PI
    let value = 0
    
    // P wave
    if (t % (2 * Math.PI) < 0.3) {
      value += 0.1 * Math.sin(t * 10)
    }
    
    // QRS complex
    if (t % (2 * Math.PI) > 0.8 && t % (2 * Math.PI) < 1.2) {
      const qrsT = (t % (2 * Math.PI) - 0.8) / 0.4
      if (qrsT < 0.3) {
        value -= 0.2 * Math.sin(qrsT * Math.PI / 0.3)
      } else if (qrsT < 0.7) {
        value += 0.8 * Math.sin((qrsT - 0.3) * Math.PI / 0.4)
      } else {
        value -= 0.3 * Math.sin((qrsT - 0.7) * Math.PI / 0.3)
      }
    }
    
    // T wave
    if (t % (2 * Math.PI) > 1.5 && t % (2 * Math.PI) < 2.0) {
      value += 0.3 * Math.sin((t % (2 * Math.PI) - 1.5) * Math.PI / 0.5)
    }
    
    // Add some noise
    value += (Math.random() - 0.5) * 0.05
    
    data.push(value)
  }
  return data
}

export function calculateEWS(vitalSigns: {
  heartRate: number
  bloodPressureSys: number
  respiratoryRate: number
  temperature: number
  oxygenSaturation: number
}): number {
  let score = 0
  
  // Heart rate scoring
  if (vitalSigns.heartRate < 40) score += 3
  else if (vitalSigns.heartRate < 51) score += 1
  else if (vitalSigns.heartRate > 130) score += 3
  else if (vitalSigns.heartRate > 110) score += 2
  else if (vitalSigns.heartRate > 100) score += 1
  
  // Blood pressure scoring
  if (vitalSigns.bloodPressureSys < 90) score += 3
  else if (vitalSigns.bloodPressureSys < 100) score += 2
  else if (vitalSigns.bloodPressureSys < 110) score += 1
  else if (vitalSigns.bloodPressureSys > 220) score += 3
  
  // Respiratory rate scoring
  if (vitalSigns.respiratoryRate < 8) score += 3
  else if (vitalSigns.respiratoryRate < 12) score += 1
  else if (vitalSigns.respiratoryRate > 24) score += 2
  else if (vitalSigns.respiratoryRate > 20) score += 1
  
  // Temperature scoring
  if (vitalSigns.temperature < 35) score += 3
  else if (vitalSigns.temperature < 36) score += 1
  else if (vitalSigns.temperature > 39) score += 2
  else if (vitalSigns.temperature > 38) score += 1
  
  // Oxygen saturation scoring
  if (vitalSigns.oxygenSaturation < 91) score += 3
  else if (vitalSigns.oxygenSaturation < 94) score += 2
  else if (vitalSigns.oxygenSaturation < 96) score += 1
  
  return score
}

export function calculateMEWS(vitalSigns: {
  heartRate: number
  bloodPressureSys: number
  respiratoryRate: number
  temperature: number
}): number {
  let score = 0
  
  // Heart rate scoring
  if (vitalSigns.heartRate < 40) score += 2
  else if (vitalSigns.heartRate < 51) score += 1
  else if (vitalSigns.heartRate > 130) score += 3
  else if (vitalSigns.heartRate > 110) score += 2
  else if (vitalSigns.heartRate > 100) score += 1
  
  // Blood pressure scoring
  if (vitalSigns.bloodPressureSys < 70) score += 3
  else if (vitalSigns.bloodPressureSys < 81) score += 2
  else if (vitalSigns.bloodPressureSys < 101) score += 1
  else if (vitalSigns.bloodPressureSys > 200) score += 2
  
  // Respiratory rate scoring
  if (vitalSigns.respiratoryRate < 9) score += 2
  else if (vitalSigns.respiratoryRate > 30) score += 3
  else if (vitalSigns.respiratoryRate > 20) score += 2
  else if (vitalSigns.respiratoryRate > 14) score += 1
  
  // Temperature scoring
  if (vitalSigns.temperature < 35) score += 2
  else if (vitalSigns.temperature > 38.5) score += 2
  
  return score
}

export function generateRandomVitalSigns() {
  const heartRate = 60 + Math.random() * 40 + (Math.random() - 0.5) * 20
  const bloodPressureSys = 110 + Math.random() * 30 + (Math.random() - 0.5) * 20
  const bloodPressureDia = 70 + Math.random() * 20 + (Math.random() - 0.5) * 10
  const respiratoryRate = 12 + Math.random() * 8 + (Math.random() - 0.5) * 4
  const temperature = 36.5 + Math.random() * 1.5 + (Math.random() - 0.5) * 0.5
  const oxygenSaturation = 95 + Math.random() * 5 + (Math.random() - 0.5) * 2
  
  return {
    heartRate: Math.max(40, Math.min(150, heartRate)),
    bloodPressureSys: Math.max(80, Math.min(200, bloodPressureSys)),
    bloodPressureDia: Math.max(50, Math.min(120, bloodPressureDia)),
    respiratoryRate: Math.max(8, Math.min(30, respiratoryRate)),
    temperature: Math.max(35, Math.min(40, temperature)),
    oxygenSaturation: Math.max(85, Math.min(100, oxygenSaturation))
  }
}