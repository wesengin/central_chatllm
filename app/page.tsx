'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MonitorCard } from '@/components/monitor-card'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

interface Monitor {
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

export default function Dashboard() {
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [loading, setLoading] = useState(true)
  const [globalMute, setGlobalMute] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const fetchMonitors = async () => {
    try {
      const response = await fetch('/api/monitors')
      if (response.ok) {
        const data = await response.json()
        setMonitors(data)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Error fetching monitors:', error)
    } finally {
      setLoading(false)
    }
  }

  const initializeMonitors = async () => {
    try {
      await fetch('/api/monitors', { method: 'POST' })
      await fetchMonitors()
    } catch (error) {
      console.error('Error initializing monitors:', error)
    }
  }

  const updateVitalSigns = async () => {
    try {
      await fetch('/api/vital-signs', { method: 'POST' })
      await fetchMonitors()
    } catch (error) {
      console.error('Error updating vital signs:', error)
    }
  }

  const handleMuteAlarm = async (monitorId: string) => {
    try {
      await fetch(`/api/monitors/${monitorId}/mute`, { method: 'POST' })
      await fetchMonitors()
    } catch (error) {
      console.error('Error muting alarm:', error)
    }
  }

  const handleGlobalMuteToggle = () => {
    setGlobalMute(!globalMute)
  }

  useEffect(() => {
    initializeMonitors()
  }, [])

  useEffect(() => {
    // Auto-update vital signs every 30 seconds
    const interval = setInterval(updateVitalSigns, 30000)
    return () => clearInterval(interval)
  }, [])

  const totalActiveAlarms = monitors.reduce((total, monitor) => 
    total + monitor.alarms.filter(alarm => alarm.isActive && !alarm.isMuted).length, 0
  )

  const criticalMonitors = monitors.filter(monitor => 
    monitor.vitalSigns[0]?.ewsScore >= 7 || 
    monitor.vitalSigns[0]?.sepsisRisk >= 0.8 ||
    monitor.vitalSigns[0]?.suddenDeathRisk >= 0.7
  ).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header globalMute={globalMute} onGlobalMuteToggle={handleGlobalMuteToggle} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header globalMute={globalMute} onGlobalMuteToggle={handleGlobalMuteToggle} />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-red-700 text-white"
        style={{
          backgroundImage: `url('https://png.pngtree.com/background/20210715/original/pngtree-red-gradient-abstract-geometric-background-picture-image_1324581.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-red-900/70"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Central Hospitalar Web
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 opacity-90"
          >
            Sistema avançado de monitoramento hospitalar com IA para predição de sepse e prevenção de morte súbita
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-sm opacity-75">Monitores Ativos:</span>
              <span className="text-2xl font-bold ml-2">{monitors.length}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-sm opacity-75">Alarmes Ativos:</span>
              <span className="text-2xl font-bold ml-2">{totalActiveAlarms}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-sm opacity-75">Críticos:</span>
              <span className="text-2xl font-bold ml-2">{criticalMonitors}</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Dashboard Controls */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard de Monitoramento
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            {totalActiveAlarms > 0 && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">{totalActiveAlarms} alarmes ativos</span>
              </div>
            )}
            <Button
              onClick={updateVitalSigns}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Monitors Grid */}
        <motion.div 
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {monitors.map((monitor, index) => (
            <motion.div
              key={monitor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <MonitorCard
                monitor={monitor}
                onMuteAlarm={handleMuteAlarm}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  )
}