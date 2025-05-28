'use client'

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Monitor, History, Settings, Volume2, VolumeX, Moon, Sun, BookOpen } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface HeaderProps {
  globalMute: boolean
  onGlobalMuteToggle: () => void
}

export function Header({ globalMute, onGlobalMuteToggle }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isActive = (path: string) => pathname === path

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-600 rounded-lg">
              <Monitor className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Central Hospitalar Web
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Sistema de Monitoramento Hospitalar
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Button
              variant={isActive('/') ? "default" : "ghost"}
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <Monitor className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={isActive('/history') ? "default" : "ghost"}
              onClick={() => router.push('/history')}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              Histórico
            </Button>
            <Button
              variant={isActive('/medical-reference') ? "default" : "ghost"}
              onClick={() => router.push('/medical-reference')}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Referência
            </Button>
            <Button
              variant={isActive('/settings') ? "default" : "ghost"}
              onClick={() => router.push('/settings')}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Global Mute Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onGlobalMuteToggle}
                className={`${globalMute ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}
              >
                {globalMute ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                {globalMute ? 'Silenciado' : 'Som Ativo'}
              </span>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
              <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}