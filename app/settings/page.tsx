'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Monitor,
  Bell,
  Palette,
  Globe,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import { useInView } from 'react-intersection-observer'

interface AlarmSettings {
  heartRateMin: number
  heartRateMax: number
  bloodPressureMin: number
  bloodPressureMax: number
  temperatureMin: number
  temperatureMax: number
  oxygenSaturationMin: number
  respiratoryRateMin: number
  respiratoryRateMax: number
}

export default function SettingsPage() {
  const [globalMute, setGlobalMute] = useState(false)
  const [alarmSettings, setAlarmSettings] = useState<AlarmSettings>({
    heartRateMin: 50,
    heartRateMax: 120,
    bloodPressureMin: 90,
    bloodPressureMax: 160,
    temperatureMin: 35.5,
    temperatureMax: 38.0,
    oxygenSaturationMin: 92,
    respiratoryRateMin: 8,
    respiratoryRateMax: 25
  })
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30)
  const [language, setLanguage] = useState('pt-BR')
  const [theme, setTheme] = useState('system')

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const handleGlobalMuteToggle = () => {
    setGlobalMute(!globalMute)
  }

  const handleSaveSettings = () => {
    // In a real implementation, this would save to the database
    localStorage.setItem('alarmSettings', JSON.stringify(alarmSettings))
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled))
    localStorage.setItem('autoRefresh', JSON.stringify(autoRefresh))
    localStorage.setItem('refreshInterval', JSON.stringify(refreshInterval))
    localStorage.setItem('language', language)
    localStorage.setItem('theme', theme)
    
    // Show success message
    alert('Configurações salvas com sucesso!')
  }

  const handleResetSettings = () => {
    setAlarmSettings({
      heartRateMin: 50,
      heartRateMax: 120,
      bloodPressureMin: 90,
      bloodPressureMax: 160,
      temperatureMin: 35.5,
      temperatureMax: 38.0,
      oxygenSaturationMin: 92,
      respiratoryRateMin: 8,
      respiratoryRateMax: 25
    })
    setSoundEnabled(true)
    setAutoRefresh(true)
    setRefreshInterval(30)
    setLanguage('pt-BR')
    setTheme('system')
  }

  useEffect(() => {
    // Load settings from localStorage
    const savedAlarmSettings = localStorage.getItem('alarmSettings')
    const savedSoundEnabled = localStorage.getItem('soundEnabled')
    const savedAutoRefresh = localStorage.getItem('autoRefresh')
    const savedRefreshInterval = localStorage.getItem('refreshInterval')
    const savedLanguage = localStorage.getItem('language')
    const savedTheme = localStorage.getItem('theme')

    if (savedAlarmSettings) setAlarmSettings(JSON.parse(savedAlarmSettings))
    if (savedSoundEnabled) setSoundEnabled(JSON.parse(savedSoundEnabled))
    if (savedAutoRefresh) setAutoRefresh(JSON.parse(savedAutoRefresh))
    if (savedRefreshInterval) setRefreshInterval(JSON.parse(savedRefreshInterval))
    if (savedLanguage) setLanguage(savedLanguage)
    if (savedTheme) setTheme(savedTheme)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header globalMute={globalMute} onGlobalMuteToggle={handleGlobalMuteToggle} />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-purple-700 text-white"
        style={{
          backgroundImage: `url('https://png.pngtree.com/background/20210717/original/pngtree-gradient-light-effect-purple-background-picture-image_1441579.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-purple-900/70"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Configurações do Sistema
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 opacity-90"
          >
            Personalize os parâmetros de monitoramento e alarmes do sistema hospitalar
          </motion.p>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Alarm Settings */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-red-600" />
                  Configurações de Alarmes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Heart Rate */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Frequência Cardíaca (bpm)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Mínimo</label>
                      <input
                        type="number"
                        value={alarmSettings.heartRateMin}
                        onChange={(e) => setAlarmSettings(prev => ({ ...prev, heartRateMin: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Máximo</label>
                      <input
                        type="number"
                        value={alarmSettings.heartRateMax}
                        onChange={(e) => setAlarmSettings(prev => ({ ...prev, heartRateMax: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Blood Pressure */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pressão Arterial Sistólica (mmHg)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Mínimo</label>
                      <input
                        type="number"
                        value={alarmSettings.bloodPressureMin}
                        onChange={(e) => setAlarmSettings(prev => ({ ...prev, bloodPressureMin: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Máximo</label>
                      <input
                        type="number"
                        value={alarmSettings.bloodPressureMax}
                        onChange={(e) => setAlarmSettings(prev => ({ ...prev, bloodPressureMax: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Temperature */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Temperatura (°C)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Mínimo</label>
                      <input
                        type="number"
                        step="0.1"
                        value={alarmSettings.temperatureMin}
                        onChange={(e) => setAlarmSettings(prev => ({ ...prev, temperatureMin: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Máximo</label>
                      <input
                        type="number"
                        step="0.1"
                        value={alarmSettings.temperatureMax}
                        onChange={(e) => setAlarmSettings(prev => ({ ...prev, temperatureMax: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Oxygen Saturation */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Saturação de Oxigênio Mínima (%)
                  </label>
                  <input
                    type="number"
                    value={alarmSettings.oxygenSaturationMin}
                    onChange={(e) => setAlarmSettings(prev => ({ ...prev, oxygenSaturationMin: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Respiratory Rate */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Frequência Respiratória (rpm)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Mínimo</label>
                      <input
                        type="number"
                        value={alarmSettings.respiratoryRateMin}
                        onChange={(e) => setAlarmSettings(prev => ({ ...prev, respiratoryRateMin: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Máximo</label>
                      <input
                        type="number"
                        value={alarmSettings.respiratoryRateMax}
                        onChange={(e) => setAlarmSettings(prev => ({ ...prev, respiratoryRateMax: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Audio Settings */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-blue-600" />
                  Configurações de Áudio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sons de Alarme
                    </label>
                    <p className="text-xs text-gray-500">
                      Ativar/desativar sons de alarme globalmente
                    </p>
                  </div>
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Silenciar Todos
                    </label>
                    <p className="text-xs text-gray-500">
                      Silenciar temporariamente todos os alarmes
                    </p>
                  </div>
                  <Switch
                    checked={globalMute}
                    onCheckedChange={setGlobalMute}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Display Settings */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-green-600" />
                  Configurações de Exibição
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Atualização Automática
                    </label>
                    <p className="text-xs text-gray-500">
                      Atualizar dados automaticamente
                    </p>
                  </div>
                  <Switch
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Intervalo de Atualização (segundos)
                  </label>
                  <select
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={!autoRefresh}
                  >
                    <option value={10}>10 segundos</option>
                    <option value={30}>30 segundos</option>
                    <option value={60}>1 minuto</option>
                    <option value={300}>5 minutos</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Language and Theme */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-600" />
                  Aparência e Idioma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Idioma
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tema
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="system">Sistema</option>
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* System Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-indigo-600" />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Status do Sistema
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Operacional
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Monitores Ativos
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    16 dispositivos
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <Globe className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Versão do Sistema
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    v1.0.0 (POC)
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Prova de Conceito (POC)
                    </h4>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                      Este sistema é uma demonstração com dados simulados. Não deve ser usado em 
                      ambientes de produção médica sem as devidas certificações e validações regulatórias.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <Button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-8 py-3"
          >
            <CheckCircle className="h-4 w-4" />
            Salvar Configurações
          </Button>
          <Button
            onClick={handleResetSettings}
            variant="outline"
            className="flex items-center gap-2 px-8 py-3"
          >
            <AlertTriangle className="h-4 w-4" />
            Restaurar Padrões
          </Button>
        </motion.div>
      </div>
    </div>
  )
}