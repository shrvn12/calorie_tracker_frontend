import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  ArcElement,
  DoughnutController,
  Tooltip,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  ArcElement,
  DoughnutController,
  Tooltip,
  Filler,
)

// A shared, minimal tooltip + grid style so every chart in the app looks consistent.
export const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#20232a',
      titleColor: '#edeff2',
      bodyColor: '#edeff2',
      borderColor: '#2c303a',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 10,
      displayColors: false,
    },
  },
}

export default ChartJS
