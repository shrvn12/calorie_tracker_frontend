<script setup>
import { computed } from 'vue'
import { Chart } from 'vue-chartjs'
import '@/lib/chartSetup'
import { baseChartOptions } from '@/lib/chartSetup'

const props = defineProps({
  labels: { type: Array, required: true },
  values: { type: Array, required: true },
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      type: 'line',
      data: props.values,
      borderColor: '#f2994a',
      backgroundColor: 'rgba(242,153,74,0.12)',
      pointBackgroundColor: '#f2994a',
      pointBorderColor: '#14161b',
      pointRadius: 3.5,
      borderWidth: 2.5,
      tension: 0.35,
      fill: true,
    },
  ],
}))

const options = computed(() => ({
  ...baseChartOptions,
  scales: {
    x: { grid: { display: false }, ticks: { color: '#9aa1ae', font: { size: 11 } } },
    y: { grid: { color: '#2c303a' }, ticks: { color: '#9aa1ae', font: { size: 11 } } },
  },
}))
</script>

<template>
  <div class="h-44">
    <Chart type="line" :data="chartData" :options="options" />
  </div>
</template>
