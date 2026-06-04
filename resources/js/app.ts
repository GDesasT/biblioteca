import '../css/app.css'
import Alpine from 'alpinejs'
import { Chart, registerables } from 'chart.js'

(globalThis as { Alpine?: typeof Alpine }).Alpine = Alpine
Alpine.start()

Chart.register(...registerables)

type ChartPayload = {
  labels: string[]
  values: number[]
}

const palette = {
  wine: '#7a1438',
  wineSoft: 'rgba(122, 20, 56, 0.14)',
  mint: '#b7f3d8',
  green: '#18b98f',
  greenDark: '#129b78',
  ink: '#1f2937',
  grid: 'rgba(100, 116, 139, 0.16)',
}

const chartColors = [
  palette.green,
  palette.wine,
  '#70e0bb',
  '#a8325f',
  '#dffbea',
  '#4fcca5',
  '#c75f82',
  '#9eeccf',
  '#64102e',
  '#2ebd93',
]

function readChartPayload(canvas: HTMLCanvasElement) {
  const payload = canvas.dataset.chart
  if (!payload) return null

  try {
    return JSON.parse(payload) as ChartPayload
  } catch {
    return null
  }
}

function baseOptions(indexAxis?: 'x' | 'y') {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: palette.ink,
          font: { weight: 'bold' as const },
        },
      },
      tooltip: {
        backgroundColor: palette.ink,
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12,
        cornerRadius: 10,
      },
    },
    scales: {
      x: {
        grid: { color: palette.grid },
        ticks: { color: palette.ink, font: { weight: 'bold' as const } },
      },
      y: {
        grid: { color: palette.grid },
        ticks: { color: palette.ink, font: { weight: 'bold' as const }, precision: 0 },
      },
    },
  }
}

function createChart(canvas: HTMLCanvasElement) {
  const payload = readChartPayload(canvas)
  if (!payload) return

  const chartType = canvas.dataset.chartType || 'bar'
  const label = canvas.dataset.chartLabel || 'Total'

  let config: any

  if (chartType === 'doughnut') {
    config = {
      type: 'doughnut',
      data: {
        labels: payload.labels,
        datasets: [
          {
            label,
            data: payload.values,
            backgroundColor: chartColors,
            borderColor: '#ffffff',
            borderWidth: 3,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: palette.ink,
              boxWidth: 12,
              padding: 16,
              font: { weight: 'bold' },
            },
          },
        },
      },
    }
  } else if (chartType === 'line') {
    config = {
      type: 'line',
      data: {
        labels: payload.labels,
        datasets: [
          {
            label,
            data: payload.values,
            borderColor: palette.wine,
            backgroundColor: palette.wineSoft,
            pointBackgroundColor: palette.green,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            fill: true,
            tension: 0.38,
          },
        ],
      },
      options: baseOptions(),
    }
  } else {
    config = {
      type: 'bar',
      data: {
        labels: payload.labels,
        datasets: [
          {
            label,
            data: payload.values,
            backgroundColor: chartColors,
            borderRadius: 10,
            borderSkipped: false,
            maxBarThickness: 34,
          },
        ],
      },
      options: baseOptions('y'),
    }
  }

  new Chart(canvas, config)
}

document.querySelectorAll<HTMLCanvasElement>('[data-chart]').forEach(createChart)
