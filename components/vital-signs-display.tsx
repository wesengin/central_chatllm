'use client'

import { motion } from 'framer-motion'
import { Heart, Activity, Thermometer, Droplets, Zap } from 'lucide-react'

interface VitalSignsDisplayProps {
  vitalSigns: {
    heartRate: number
    bloodPressureSys: number
    bloodPressureDia: number
    respiratoryRate: number
    temperature: number
    oxygenSaturation: number
  }
  animated?: boolean
}

export function VitalSignsDisplay({ vitalSigns, animated = true }: VitalSignsDisplayProps) {
  const signs = [
    {
      icon: Heart,
      label: 'FC',
      value: Math.round(vitalSigns.heartRate),
      unit: 'bpm',
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/20'
    },
    {
      icon: Activity,
      label: 'PA',
      value: `${Math.round(vitalSigns.bloodPressureSys)}/${Math.round(vitalSigns.bloodPressureDia)}`,
      unit: 'mmHg',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
      icon: Thermometer,
      label: 'Temp',
      value: vitalSigns.temperature.toFixed(1),
      unit: '°C',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20'
    },
    {
      icon: Droplets,
      label: 'SpO₂',
      value: Math.round(vitalSigns.oxygenSaturation),
      unit: '%',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/20'
    },
    {
      icon: Zap,
      label: 'FR',
      value: Math.round(vitalSigns.respiratoryRate),
      unit: 'rpm',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/20'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {signs.map((sign, index) => (
        <motion.div
          key={sign.label}
          initial={animated ? { opacity: 0, scale: 0.8 } : {}}
          animate={animated ? { opacity: 1, scale: 1 } : {}}
          transition={animated ? { delay: index * 0.1 } : {}}
          className={`text-center p-4 rounded-lg ${sign.bgColor}`}
        >
          <sign.icon className={`h-6 w-6 ${sign.color} mx-auto mb-2`} />
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {sign.value}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {sign.label} ({sign.unit})
          </div>
        </motion.div>
      ))}
    </div>
  )
}