'use client'

import { motion } from 'framer-motion'
import { Heart, Activity, Zap } from 'lucide-react'

interface LoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'medical' | 'minimal'
}

export function Loading({ 
  message = 'Carregando...', 
  size = 'md',
  variant = 'default' 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center p-4">
        <div className={`animate-spin rounded-full border-b-2 border-red-600 ${sizeClasses[size]}`} />
      </div>
    )
  }

  if (variant === 'medical') {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Heart className="h-8 w-8 text-red-500" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          >
            <Activity className="h-8 w-8 text-blue-500" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          >
            <Zap className="h-8 w-8 text-green-500" />
          </motion.div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-center">{message}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className={`rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-red-600 ${sizeClasses[size]}`}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-600 dark:text-gray-400 text-center"
      >
        {message}
      </motion.p>
    </div>
  )
}

export function PageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <Loading 
        message="Carregando Sistema Hospitalar..." 
        size="lg" 
        variant="medical" 
      />
    </div>
  )
}

export function ComponentLoading({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loading message={message} variant="minimal" />
    </div>
  )
}