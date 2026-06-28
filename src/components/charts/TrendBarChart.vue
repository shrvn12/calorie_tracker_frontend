<script setup>
import { computed } from 'vue'
import { Chart } from 'vue-chartjs'
import '@/lib/chartSetup'
import { baseChartOptions } from '@/lib/chartSetup'

const props = defineProps({
  labels: { type: Array, required: true },
  values: { type: Array, required: true },
  target: { type: Number, default: null },
  barColor: { type: String, default: '#f2994a' },
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      type: 'bar',
      data: props.values,
      backgroundColor: props.barColor,
      borderRadius: 6,
      maxBarThickness: 22,
      order: 2,
    },
    ...(props.target
      ? [
          {
            type: 'line',
            data: props.labels.map(() => props.target),
            borderColor: '#9aa1ae',
            borderDash: [5, 5],
            borderWidth: 1.5,
            pointRadius: 0,
            order: 1,
          },
        ]
      : []),
  ],
}))

const options = computed(() => ({
  ...baseChartOptions,
  scales: {
    x: { grid: { display: false }, ticks: { color: '#9aa1ae', font: { size: 11 } } },
    y: { grid: { color: '#2c303a' }, ticks: { color: '#9aa1ae', font: { size: 11 } }, beginAtZero: true },
  },
}))
</script>

<template>
  <div class="h-44">
    <Chart type="bar" :data="chartData" :options="options" />
  </div>
</template>
