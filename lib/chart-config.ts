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

// Default chart options
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
    point: {
      radius: 0,
      hoverRadius: 4,
    },
  },
}

// ECG chart specific options
export const ecgChartOptions = {
  ...defaultChartOptions,
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
    point: {
      radius: 0,
    },
  },
}

// Vital signs trend chart options
export const vitalSignsChartOptions = {
  ...defaultChartOptions,
  plugins: {
    ...defaultChartOptions.plugins,
    title: {
      display: true,
      text: 'Tendência dos Sinais Vitais',
      color: 'rgba(255, 255, 255, 0.9)',
    },
  },
}

// Color palette for charts
export const chartColors = {
  heartRate: '#ef4444',
  bloodPressure: '#3b82f6',
  temperature: '#f97316',
  oxygenSaturation: '#06b6d4',
  respiratoryRate: '#22c55e',
  ewsScore: '#8b5cf6',
  sepsisRisk: '#f59e0b',
  suddenDeathRisk: '#dc2626',
}

// Generate chart data for vital signs
export function generateVitalSignsChartData(vitalSigns: any[], type: string) {
  const labels = vitalSigns.map((_, index) => `${index + 1}`)
  
  const datasets = []
  
  switch (type) {
    case 'heartRate':
      datasets.push({
        label: 'Frequência Cardíaca (bpm)',
        data: vitalSigns.map(vs => vs.heartRate),
        borderColor: chartColors.heartRate,
        backgroundColor: `${chartColors.heartRate}20`,
      })
      break
    case 'bloodPressure':
      datasets.push(
        {
          label: 'Pressão Sistólica (mmHg)',
          data: vitalSigns.map(vs => vs.bloodPressureSys),
          borderColor: chartColors.bloodPressure,
          backgroundColor: `${chartColors.bloodPressure}20`,
        },
        {
          label: 'Pressão Diastólica (mmHg)',
          data: vitalSigns.map(vs => vs.bloodPressureDia),
          borderColor: chartColors.bloodPressure,
          backgroundColor: `${chartColors.bloodPressure}10`,
          borderDash: [5, 5],
        }
      )
      break
    case 'temperature':
      datasets.push({
        label: 'Temperatura (°C)',
        data: vitalSigns.map(vs => vs.temperature),
        borderColor: chartColors.temperature,
        backgroundColor: `${chartColors.temperature}20`,
      })
      break
    case 'oxygenSaturation':
      datasets.push({
        label: 'Saturação O₂ (%)',
        data: vitalSigns.map(vs => vs.oxygenSaturation),
        borderColor: chartColors.oxygenSaturation,
        backgroundColor: `${chartColors.oxygenSaturation}20`,
      })
      break
    case 'respiratoryRate':
      datasets.push({
        label: 'Frequência Respiratória (rpm)',
        data: vitalSigns.map(vs => vs.respiratoryRate),
        borderColor: chartColors.respiratoryRate,
        backgroundColor: `${chartColors.respiratoryRate}20`,
      })
      break
    case 'scores':
      datasets.push(
        {
          label: 'EWS Score',
          data: vitalSigns.map(vs => vs.ewsScore),
          borderColor: chartColors.ewsScore,
          backgroundColor: `${chartColors.ewsScore}20`,
        },
        {
          label: 'MEWS Score',
          data: vitalSigns.map(vs => vs.mewsScore),
          borderColor: chartColors.ewsScore,
          backgroundColor: `${chartColors.ewsScore}10`,
          borderDash: [5, 5],
        }
      )
      break
    case 'risks':
      datasets.push(
        {
          label: 'Risco de Sepse (%)',
          data: vitalSigns.map(vs => vs.sepsisRisk * 100),
          borderColor: chartColors.sepsisRisk,
          backgroundColor: `${chartColors.sepsisRisk}20`,
        },
        {
          label: 'Risco de Morte Súbita (%)',
          data: vitalSigns.map(vs => vs.suddenDeathRisk * 100),
          borderColor: chartColors.suddenDeathRisk,
          backgroundColor: `${chartColors.suddenDeathRisk}20`,
        }
      )
      break
    default:
      // All vital signs
      datasets.push(
        {
          label: 'Frequência Cardíaca (bpm)',
          data: vitalSigns.map(vs => vs.heartRate),
          borderColor: chartColors.heartRate,
          backgroundColor: `${chartColors.heartRate}20`,
        },
        {
          label: 'Pressão Sistólica (mmHg)',
          data: vitalSigns.map(vs => vs.bloodPressureSys),
          borderColor: chartColors.bloodPressure,
          backgroundColor: `${chartColors.bloodPressure}20`,
        },
        {
          label: 'Saturação O₂ (%)',
          data: vitalSigns.map(vs => vs.oxygenSaturation),
          borderColor: chartColors.oxygenSaturation,
          backgroundColor: `${chartColors.oxygenSaturation}20`,
        }
      )
  }
  
  return { labels, datasets }
}