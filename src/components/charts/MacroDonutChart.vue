<script setup>
import { computed } from 'vue'
import { Chart } from 'vue-chartjs'
import '@/lib/chartSetup'

const props = defineProps({
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
})

const colors = { protein: '#e07a8b', carbs: '#f2c572', fat: '#6fb8e0' }

const chartData = computed(() => ({
  labels: ['Protein', 'Carbs', 'Fat'],
  datasets: [
    {
      data: [props.protein, props.carbs, props.fat],
      backgroundColor: [colors.protein, colors.carbs, colors.fat],
      borderWidth: 0,
      hoverOffset: 4,
    },
  ],
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
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
    },
  },
}

const total = computed(() => props.protein + props.carbs + props.fat)
const rows = computed(() => [
  { label: 'Protein', value: props.protein, color: colors.protein, text: 'text-protein' },
  { label: 'Carbs', value: props.carbs, color: colors.carbs, text: 'text-carbs' },
  { label: 'Fat', value: props.fat, color: colors.fat, text: 'text-fat' },
])
</script>

<template>
  <div class="flex items-center gap-5">
    <div class="relative h-32 w-32 shrink-0">
      <Chart type="doughnut" :data="chartData" :options="options" />
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-sm font-bold tabular text-foreground">{{ Math.round(total) }}g</span>
        <span class="text-[10px] text-muted-foreground">total</span>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div v-for="row in rows" :key="row.label" class="flex items-center gap-2">
        <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: row.color }" />
        <span class="text-sm text-foreground">{{ row.label }}</span>
        <span class="text-sm font-semibold tabular" :class="row.text">{{ Math.round(row.value) }}g</span>
      </div>
    </div>
  </div>
</template>
