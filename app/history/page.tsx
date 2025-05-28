'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  History, 
  Download, 
  Filter,
  Calendar,
  FileText,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'
import { useInView } from 'react-intersection-observer'

interface VitalSignHistory {
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
  monitor: {
    id: string
    name: string
    location: string
    patientName?: string
  }
}

interface HistoryData {
  data: VitalSignHistory[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<HistoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [globalMute, setGlobalMute] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMonitor, setSelectedMonitor] = useState<string>('')
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
    end: new Date().toISOString().split('T')[0] // Today
  })

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50'
      })
      
      if (selectedMonitor) {
        params.append('monitorId', selectedMonitor)
      }
      
      if (dateRange.start && dateRange.end) {
        params.append('startDate', new Date(dateRange.start).toISOString())
        params.append('endDate', new Date(dateRange.end + 'T23:59:59').toISOString())
      }

      const response = await fetch(`/api/history?${params}`)
      if (response.ok) {
        const data = await response.json()
        setHistoryData(data)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePDFReport = () => {
    // In a real implementation, this would generate a PDF report
    // For now, we'll create a simple text report and trigger download
    if (!historyData) return

    const reportContent = `
RELATÓRIO DE MONITORAMENTO HOSPITALAR
=====================================

Período: ${new Date(dateRange.start).toLocaleDateString('pt-BR')} - ${new Date(dateRange.end).toLocaleDateString('pt-BR')}
Total de Registros: ${historyData.pagination.total}

RESUMO ESTATÍSTICO:
------------------
${historyData.data.length > 0 ? `
Frequência Cardíaca Média: ${(historyData.data.reduce((sum, item) => sum + item.heartRate, 0) / historyData.data.length).toFixed(1)} bpm
Pressão Arterial Média: ${(historyData.data.reduce((sum, item) => sum + item.bloodPressureSys, 0) / historyData.data.length).toFixed(1)}/${(historyData.data.reduce((sum, item) => sum + item.bloodPressureDia, 0) / historyData.data.length).toFixed(1)} mmHg
Temperatura Média: ${(historyData.data.reduce((sum, item) => sum + item.temperature, 0) / historyData.data.length).toFixed(1)}°C
Saturação O₂ Média: ${(historyData.data.reduce((sum, item) => sum + item.oxygenSaturation, 0) / historyData.data.length).toFixed(1)}%

EWS Score Médio: ${(historyData.data.reduce((sum, item) => sum + item.ewsScore, 0) / historyData.data.length).toFixed(1)}
MEWS Score Médio: ${(historyData.data.reduce((sum, item) => sum + item.mewsScore, 0) / historyData.data.length).toFixed(1)}

Risco Médio de Sepse: ${(historyData.data.reduce((sum, item) => sum + item.sepsisRisk, 0) / historyData.data.length * 100).toFixed(1)}%
Risco Médio de Morte Súbita: ${(historyData.data.reduce((sum, item) => sum + item.suddenDeathRisk, 0) / historyData.data.length * 100).toFixed(1)}%
` : 'Nenhum dado disponível para o período selecionado.'}

DETALHES DOS REGISTROS:
----------------------
${historyData.data.map(item => `
${new Date(item.timestamp).toLocaleString('pt-BR')} - ${item.monitor.name}
Paciente: ${item.monitor.patientName || 'N/A'}
FC: ${item.heartRate.toFixed(1)} bpm | PA: ${item.bloodPressureSys.toFixed(1)}/${item.bloodPressureDia.toFixed(1)} mmHg
Temp: ${item.temperature.toFixed(1)}°C | SpO₂: ${item.oxygenSaturation.toFixed(1)}%
EWS: ${item.ewsScore} | MEWS: ${item.mewsScore}
Risco Sepse: ${(item.sepsisRisk * 100).toFixed(1)}% | Risco PMS: ${(item.suddenDeathRisk * 100).toFixed(1)}%
`).join('\n')}

Relatório gerado em: ${new Date().toLocaleString('pt-BR')}
Sistema: Central Hospitalar Web
    `.trim()

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `relatorio-hospitalar-${dateRange.start}-${dateRange.end}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleGlobalMuteToggle = () => {
    setGlobalMute(!globalMute)
  }

  useEffect(() => {
    fetchHistory()
  }, [])

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header globalMute={globalMute} onGlobalMuteToggle={handleGlobalMuteToggle} />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-blue-900/70"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Histórico de Dados
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 opacity-90"
          >
            Análise histórica dos sinais vitais e relatórios detalhados de monitoramento
          </motion.p>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filtros e Controles
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              {/* Date Range */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-gray-600 dark:text-gray-400">até</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => fetchHistory(1)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Filter className="h-4 w-4" />
                  Filtrar
                </Button>
                <Button
                  onClick={generatePDFReport}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={!historyData || historyData.data.length === 0}
                >
                  <Download className="h-4 w-4" />
                  Relatório
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        {historyData && historyData.data.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total de Registros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {historyData.pagination.total}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  EWS Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(historyData.data.reduce((sum, item) => sum + item.ewsScore, 0) / historyData.data.length).toFixed(1)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Risco Sepse Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(historyData.data.reduce((sum, item) => sum + item.sepsisRisk, 0) / historyData.data.length * 100).toFixed(1)}%
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Risco PMS Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(historyData.data.reduce((sum, item) => sum + item.suddenDeathRisk, 0) / historyData.data.length * 100).toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* History Table */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-blue-600" />
                Registros Históricos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : historyData && historyData.data.length > 0 ? (
                <div className="space-y-4">
                  {historyData.data.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {record.monitor.name}
                            </h3>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {record.monitor.patientName}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {new Date(record.timestamp).toLocaleString('pt-BR')}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">FC:</span>
                              <span className="ml-1 font-medium">{record.heartRate.toFixed(1)} bpm</span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">PA:</span>
                              <span className="ml-1 font-medium">
                                {record.bloodPressureSys.toFixed(1)}/{record.bloodPressureDia.toFixed(1)} mmHg
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Temp:</span>
                              <span className="ml-1 font-medium">{record.temperature.toFixed(1)}°C</span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">SpO₂:</span>
                              <span className="ml-1 font-medium">{record.oxygenSaturation.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={getScoreBadgeColor(record.ewsScore)}>
                            EWS: {record.ewsScore}
                          </Badge>
                          <Badge variant={getScoreBadgeColor(record.mewsScore)}>
                            MEWS: {record.mewsScore}
                          </Badge>
                          <Badge variant={getRiskBadgeColor(record.sepsisRisk)}>
                            Sepse: {(record.sepsisRisk * 100).toFixed(0)}%
                          </Badge>
                          <Badge variant={getRiskBadgeColor(record.suddenDeathRisk)}>
                            PMS: {(record.suddenDeathRisk * 100).toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Pagination */}
                  {historyData.pagination.pages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => fetchHistory(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </Button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Página {currentPage} de {historyData.pagination.pages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => fetchHistory(currentPage + 1)}
                        disabled={currentPage === historyData.pagination.pages}
                      >
                        Próxima
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Nenhum registro encontrado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tente ajustar os filtros ou o período de busca.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}