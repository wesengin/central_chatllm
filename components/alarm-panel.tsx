'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Volume2, VolumeX, Clock } from 'lucide-react'

interface Alarm {
  id: string
  type: string
  severity: string
  message: string
  isActive: boolean
  isMuted: boolean
  timestamp: string
}

interface AlarmPanelProps {
  alarms: Alarm[]
  onMuteAlarm?: (alarmId: string) => void
  onResolveAlarm?: (alarmId: string) => void
}

export function AlarmPanel({ alarms, onMuteAlarm, onResolveAlarm }: AlarmPanelProps) {
  const activeAlarms = alarms.filter(alarm => alarm.isActive)
  const criticalAlarms = activeAlarms.filter(alarm => alarm.severity === 'CRITICAL')
  const highAlarms = activeAlarms.filter(alarm => alarm.severity === 'HIGH')

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'destructive'
      case 'HIGH':
        return 'secondary'
      case 'MEDIUM':
        return 'default'
      default:
        return 'outline'
    }
  }

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'border-red-500 bg-red-50 dark:bg-red-950/20'
      case 'HIGH':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
      case 'MEDIUM':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
      default:
        return 'border-gray-300 dark:border-gray-600'
    }
  }

  if (activeAlarms.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-green-600" />
            Painel de Alarmes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-green-600 dark:text-green-400 mb-2">
              <AlertTriangle className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum Alarme Ativo
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Todos os sistemas estão funcionando normalmente
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Painel de Alarmes ({activeAlarms.length})
          </div>
          <div className="flex items-center gap-2">
            {criticalAlarms.length > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {criticalAlarms.length} Críticos
              </Badge>
            )}
            {highAlarms.length > 0 && (
              <Badge variant="secondary">
                {highAlarms.length} Altos
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activeAlarms.map((alarm, index) => (
            <motion.div
              key={alarm.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg border-l-4 ${getSeverityBgColor(alarm.severity)}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getSeverityColor(alarm.severity)}>
                      {alarm.severity}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {alarm.type.replace('_', ' ')}
                    </Badge>
                    {alarm.isMuted && (
                      <VolumeX className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {alarm.message}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {new Date(alarm.timestamp).toLocaleString('pt-BR')}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {onMuteAlarm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMuteAlarm(alarm.id)}
                      className="h-8 w-8 p-0"
                    >
                      {alarm.isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  {onResolveAlarm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onResolveAlarm(alarm.id)}
                      className="text-xs"
                    >
                      Resolver
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}