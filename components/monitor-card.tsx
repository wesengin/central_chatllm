'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Activity, Thermometer, Droplets, Volume2, VolumeX } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

const Line = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
  ssr: false,
  loading: () => <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
})

interface MonitorCardProps {
  monitor: {
    id: string
    name: string
    location: string
    patientName?: string
    patientAge?: number
    vitalSigns: Array<{
      heartRate: number
      bloodPressureSys: number
      bloodPressureDia: number
      respiratoryRate: number
      temperature: number
      oxygenSaturation: number
      ewsScore: number
      mewsScore: number
      sepsisRisk: number
      suddenDeathRisk: number
    }>
    alarms: Array<{
      id: string
      type: string
      severity: string
      message: string
      isActive: boolean
      isMuted: boolean
    }>
  }
  onMuteAlarm: (monitorId: string) => void
}

export function MonitorCard({ monitor, onMuteAlarm }: MonitorCardProps) {
  const router = useRouter()
  const [ecgData, setEcgData] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  
  const latestVitals = monitor.vitalSigns[0]
  const activeAlarms = monitor.alarms.filter(alarm => alarm.isActive && !alarm.isMuted)
  const hasActiveAlarms = activeAlarms.length > 0
  
  useEffect(() => {
    // Generate ECG data
    const generateECGData = () => {
      const data: number[] = []
      for (let i = 0; i < 50; i++) {
        const t = (i / 50) * 4 * Math.PI
        let value = 0
        
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
        
        value += (Math.random() - 0.5) * 0.05
        data.push(value)
      }
      return data
    }
    
    setEcgData(generateECGData())
    
    // Update ECG data periodically
    const interval = setInterval(() => {
      setEcgData(generateECGData())
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  useEffect(() => {
    // Play alarm sound if there are active alarms
    if (hasActiveAlarms && !isPlaying) {
      setIsPlaying(true)
      // In a real implementation, you would play an actual alarm sound
      setTimeout(() => setIsPlaying(false), 2000)
    }
  }, [hasActiveAlarms, isPlaying])
  
  const chartData = {
    labels: Array.from({ length: ecgData.length }, (_, i) => i),
    datasets: [
      {
        data: ecgData,
        borderColor: hasActiveAlarms ? '#ef4444' : '#22c55e',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1,
      },
    ],
  }
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0.1,
      },
    },
  }
  
  const getScoreBadgeColor = (score: number) => {
    if (score >= 7) return "destructive"
    if (score >= 5) return "secondary"
    return "default"
  }
  
  const getRiskBadgeColor = (risk: number) => {
    if (risk >= 0.8) return "destructive"
    if (risk >= 0.5) return "secondary"
    return "default"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
          hasActiveAlarms ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 'border-gray-200 dark:border-gray-700'
        }`}
        onClick={() => router.push(`/monitor/${monitor.id}`)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {monitor.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              {hasActiveAlarms && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onMuteAlarm(monitor.id)
                  }}
                  className="h-8 w-8 text-red-500 hover:text-red-600"
                >
                  {activeAlarms.some(alarm => !alarm.isMuted) ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              )}
              <div className={`w-3 h-3 rounded-full ${hasActiveAlarms ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{monitor.location}</p>
          {monitor.patientName && (
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {monitor.patientName}, {monitor.patientAge} anos
            </p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* ECG Preview */}
          <div className="h-20 bg-black rounded-lg p-2">
            <Line data={chartData} options={chartOptions} />
          </div>
          
          {/* Vital Signs */}
          {latestVitals && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="font-medium">{Math.round(latestVitals.heartRate)} bpm</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="font-medium">
                  {Math.round(latestVitals.bloodPressureSys)}/{Math.round(latestVitals.bloodPressureDia)} mmHg
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <span className="font-medium">{latestVitals.temperature.toFixed(1)}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-cyan-500" />
                <span className="font-medium">{Math.round(latestVitals.oxygenSaturation)}%</span>
              </div>
            </div>
          )}
          
          {/* Scores and Risk Assessment */}
          {latestVitals && (
            <div className="flex flex-wrap gap-2">
              <Badge variant={getScoreBadgeColor(latestVitals.ewsScore)}>
                EWS: {latestVitals.ewsScore}
              </Badge>
              <Badge variant={getScoreBadgeColor(latestVitals.mewsScore)}>
                MEWS: {latestVitals.mewsScore}
              </Badge>
              <Badge variant={getRiskBadgeColor(latestVitals.sepsisRisk)}>
                Sepse: {(latestVitals.sepsisRisk * 100).toFixed(0)}%
              </Badge>
              <Badge variant={getRiskBadgeColor(latestVitals.suddenDeathRisk)}>
                PMS: {(latestVitals.suddenDeathRisk * 100).toFixed(0)}%
              </Badge>
            </div>
          )}
          
          {/* Active Alarms */}
          {activeAlarms.length > 0 && (
            <div className="space-y-1">
              {activeAlarms.slice(0, 2).map((alarm) => (
                <div key={alarm.id} className="text-xs text-red-600 dark:text-red-400 font-medium">
                  {alarm.message}
                </div>
              ))}
              {activeAlarms.length > 2 && (
                <div className="text-xs text-red-600 dark:text-red-400">
                  +{activeAlarms.length - 2} mais alarmes
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}