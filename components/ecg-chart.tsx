'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface ECGChartProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  isActive?: boolean
}

export function ECGChart({ 
  data, 
  width = 300, 
  height = 100, 
  color = '#22c55e',
  isActive = true 
}: ECGChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Clear canvas
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 0.5
    
    // Vertical grid lines
    for (let x = 0; x < width; x += 10) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    
    // Horizontal grid lines
    for (let y = 0; y < height; y += 10) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw ECG waveform
    if (data.length > 0) {
      ctx.strokeStyle = isActive ? color : '#666666'
      ctx.lineWidth = 2
      ctx.beginPath()

      const stepX = width / (data.length - 1)
      const centerY = height / 2
      const scaleY = height * 0.3

      data.forEach((value, index) => {
        const x = index * stepX
        const y = centerY - (value * scaleY)

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Add glow effect for active monitors
      if (isActive) {
        ctx.shadowColor = color
        ctx.shadowBlur = 10
        ctx.stroke()
        ctx.shadowBlur = 0
      }
    }
  }, [data, width, height, color, isActive])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <canvas
        ref={canvasRef}
        className="rounded border border-gray-700"
        style={{ width: '100%', height: 'auto' }}
      />
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded">
          <span className="text-red-500 text-sm font-medium">DESCONECTADO</span>
        </div>
      )}
    </motion.div>
  )
}