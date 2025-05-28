'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { VitalSignsDisplay } from '@/components/vital-signs-display'
import { AlarmPanel } from '@/components/alarm-panel'
import { ECGChart } from '@/components/ecg-chart'
import { ChartWrapper } from '@/components/chart-wrapper'
import { 
  ArrowLeft, 
  Activity,
  TrendingUp,
  FileText,
  Zap,
  Download
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { generateVitalSignsChartData, vitalSignsChartOptions } from '@/lib/chart-config'
import { generateECGData } from '@/lib/utils'

const Line = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
})

interface Monitor {
  id: string
  name: string
  location: string
  patientName?: string
  patientAge?: number
  vitalSigns: Array<{
    id: string
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
    timestamp: string
  }>
  alarms: Array<{
    id: string
    type: string
    severity: string
    message: string
    isActive: boolean
    isMuted: boolean
    timestamp: string
  }>
}

export default function MonitorDetail() {
  const params = useParams()
  const router = useRouter()
  const [monitor, setMonitor] = useState<Monitor | null>(null)
  const [loading, setLoading] = useState(true)
  const [globalMute, setGlobalMute] = useState(false)
  const [ecgData, setEcgData] = useState<number[]>([])
  const [selectedChart, setSelectedChart] = useState('all')

  const fetchMonitor = async () => {
    try {
      const response = await fetch(`/api/monitors/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setMonitor(data)
      }
    } catch (error) {
      console.error('Error fetching monitor:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMuteAlarm = async (alarmId: string) => {
    try {
      await fetch(`/api/monitors/${params.id}/mute`, { method: 'POST' })
      await fetchMonitor()
    } catch (error) {
      console.error('Error muting alarm:', error)
    }
  }

  const handleGlobalMuteToggle = () => {
    setGlobalMute(!globalMute)
  }

  const generatePDFReport = () => {
    if (!monitor) return

    const latestVitals = monitor.vitalSigns[0]
    const reportContent = `
RELATÓRIO DETALHADO DO MONITOR
==============================

Monitor: ${monitor.name}
Localização: ${monitor.location}
Paciente: ${monitor.patientName}, ${monitor.patientAge} anos
Data/Hora: ${new Date().toLocaleString('pt-BR')}

SINAIS VITAIS ATUAIS:
--------------------
Frequência Cardíaca: ${latestVitals?.heartRate.toFixed(1)} bpm
Pressão Arterial: ${latestVitals?.bloodPressureSys.toFixed(1)}/${latestVitals?.bloodPressureDia.toFixed(1)} mmHg
Frequência Respiratória: ${latestVitals?.respiratoryRate.toFixed(1)} rpm
Temperatura: ${latestVitals?.temperature.toFixed(1)}°C
Saturação de Oxigênio: ${latestVitals?.oxygenSaturation.toFixed(1)}%

PONTUAÇÕES DE ALERTA:
--------------------
EWS Score: ${latestVitals?.ewsScore}
MEWS Score: ${latestVitals?.mewsScore}

AVALIAÇÃO DE RISCO IA:
---------------------
Risco de Sepse: ${latestVitals ? (latestVitals.sepsisRisk * 100).toFixed(1) : 0}%
Risco de Morte Súbita: ${latestVitals ? (latestVitals.suddenDeathRisk * 100).toFixed(1) : 0}%

JUSTIFICATIVAS:
--------------
${latestVitals ? getEWSJustification(latestVitals.ewsScore) : ''}

${latestVitals ? getSepsisJustification(latestVitals.sepsisRisk) : ''}

${latestVitals ? getSuddenDeathJustification(latestVitals.suddenDeathRisk) : ''}

ALARMES ATIVOS:
--------------
${monitor.alarms.filter(alarm => alarm.isActive).map(alarm => 
  `${alarm.severity}: ${alarm.message} (${new Date(alarm.timestamp).toLocaleString('pt-BR')})`
).join('\n')}

HISTÓRICO RECENTE (Últimas 10 leituras):
---------------------------------------
${monitor.vitalSigns.slice(0, 10).map(vs => 
  `${new Date(vs.timestamp).toLocaleString('pt-BR')}: FC=${vs.heartRate.toFixed(1)} PA=${vs.bloodPressureSys.toFixed(1)}/${vs.bloodPressureDia.toFixed(1)} Temp=${vs.temperature.toFixed(1)} SpO2=${vs.oxygenSaturation.toFixed(1)}%`
).join('\n')}

Relatório gerado pelo Sistema Central Hospitalar Web
    `.trim()

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `relatorio-monitor-${monitor.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    fetchMonitor()
    const interval = setInterval(fetchMonitor, 10000) // Update every 10 seconds
    return () => clearInterval(interval)
  }, [params.id])

  useEffect(() => {
    // Generate ECG data
    const interval = setInterval(() => {
      setEcgData(generateECGData(100))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

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

  if (!monitor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header globalMute={globalMute} onGlobalMuteToggle={handleGlobalMuteToggle} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monitor não encontrado</h1>
            <Button onClick={() => router.push('/')} className="mt-4">
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const latestVitals = monitor.vitalSigns[0]
  const activeAlarms = monitor.alarms.filter(alarm => alarm.isActive)

  // Prepare chart data
  const chartData = generateVitalSignsChartData(
    monitor.vitalSigns.slice(0, 20).reverse(), 
    selectedChart
  )

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

  const getEWSJustification = (score: number) => {
    if (score >= 7) {
      return "Pontuação crítica. Requer avaliação médica imediata e possível transferência para UTI. Monitoramento contínuo necessário."
    } else if (score >= 5) {
      return "Pontuação alta. Necessária avaliação médica urgente e aumento da frequência de monitoramento."
    } else if (score >= 3) {
      return "Pontuação moderada. Recomenda-se avaliação médica e monitoramento mais frequente."
    } else {
      return "Pontuação normal. Continuar monitoramento de rotina."
    }
  }

  const getSepsisJustification = (risk: number) => {
    if (risk >= 0.8) {
      return "Alto risco de sepse detectado. Iniciar protocolo de sepse imediatamente. Considerar antibioticoterapia empírica."
    } else if (risk >= 0.5) {
      return "Risco moderado de sepse. Monitoramento intensivo e avaliação clínica detalhada recomendados."
    } else {
      return "Baixo risco de sepse. Continuar monitoramento de rotina."
    }
  }

  const getSuddenDeathJustification = (risk: number) => {
    if (risk >= 0.7) {
      return "Alto risco de morte súbita. Monitoramento cardíaco contínuo e equipe de emergência em alerta."
    } else if (risk >= 0.4) {
      return "Risco moderado de morte súbita. Aumentar frequência de monitoramento e avaliação cardiológica."
    } else {
      return "Baixo risco de morte súbita. Continuar monitoramento de rotina."
    }
  }

  return (
    <ChartWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header globalMute={globalMute} onGlobalMuteToggle={handleGlobalMuteToggle} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {monitor.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {monitor.location} • {monitor.patientName}, {monitor.patientAge} anos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={generatePDFReport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Relatório
              </Button>
              <div className="flex items-center gap-2">
                {activeAlarms.length > 0 && (
                  <Badge variant="destructive" className="animate-pulse">
                    {activeAlarms.length} Alarmes Ativos
                  </Badge>
                )}
                <div className={`w-4 h-4 rounded-full ${activeAlarms.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - ECG and Vital Signs */}
            <div className="lg:col-span-2 space-y-6">
              {/* ECG Display */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-red-600" />
                      Eletrocardiograma (ECG)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32">
                      <ECGChart 
                        data={ecgData} 
                        color={activeAlarms.length > 0 ? '#ef4444' : '#22c55e'}
                        isActive={true}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Current Vital Signs */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Sinais Vitais Atuais
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {latestVitals && (
                      <VitalSignsDisplay vitalSigns={latestVitals} animated={true} />
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Trends Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Tendências dos Sinais Vitais
                      </div>
                      <select
                        value={selectedChart}
                        onChange={(e) => setSelectedChart(e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="all">Todos os Sinais</option>
                        <option value="heartRate">Frequência Cardíaca</option>
                        <option value="bloodPressure">Pressão Arterial</option>
                        <option value="temperature">Temperatura</option>
                        <option value="oxygenSaturation">Saturação O₂</option>
                        <option value="respiratoryRate">Freq. Respiratória</option>
                        <option value="scores">Pontuações EWS/MEWS</option>
                        <option value="risks">Riscos de IA</option>
                      </select>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <Line data={chartData} options={vitalSignsChartOptions} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Scores, Risks and Alarms */}
            <div className="space-y-6">
              {/* EWS/MEWS Scores */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      Pontuações de Alerta
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {latestVitals && (
                      <>
                        <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">EWS Score</span>
                            <Badge variant={getScoreBadgeColor(latestVitals.ewsScore)}>
                              {latestVitals.ewsScore}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getEWSJustification(latestVitals.ewsScore)}
                          </p>
                        </div>
                        
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">MEWS Score</span>
                            <Badge variant={getScoreBadgeColor(latestVitals.mewsScore)}>
                              {latestVitals.mewsScore}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Modified Early Warning Score para avaliação de deterioração clínica.
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* AI Risk Assessment */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      Avaliação de Risco IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {latestVitals && (
                      <>
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Risco de Sepse</span>
                            <Badge variant={getRiskBadgeColor(latestVitals.sepsisRisk)}>
                              {(latestVitals.sepsisRisk * 100).toFixed(0)}%
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getSepsisJustification(latestVitals.sepsisRisk)}
                          </p>
                        </div>
                        
                        <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Risco de Morte Súbita</span>
                            <Badge variant={getRiskBadgeColor(latestVitals.suddenDeathRisk)}>
                              {(latestVitals.suddenDeathRisk * 100).toFixed(0)}%
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getSuddenDeathJustification(latestVitals.suddenDeathRisk)}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Alarm Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <AlarmPanel 
                  alarms={monitor.alarms} 
                  onMuteAlarm={handleMuteAlarm}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ChartWrapper>
  )
}