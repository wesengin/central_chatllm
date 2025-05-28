'use client'

import { useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface ChartWrapperProps {
  children: React.ReactNode
}

export function ChartWrapper({ children }: ChartWrapperProps) {
  useEffect(() => {
    // Ensure Chart.js is properly initialized
    return () => {
      // Cleanup if needed
    }
  }, [])

  return <>{children}</>
}