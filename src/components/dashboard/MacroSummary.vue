<script setup>
import { computed } from 'vue'
import Progress from '@/components/ui/Progress.vue'

const props = defineProps({
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  targets: { type: Object, required: true }, // { protein, carbs, fat }
})

const rows = computed(() => [
  { key: 'protein', label: 'Protein', value: props.protein, target: props.targets.protein, color: 'bg-protein', text: 'text-protein' },
  { key: 'carbs', label: 'Carbs', value: props.carbs, target: props.targets.carbs, color: 'bg-carbs', text: 'text-carbs' },
  { key: 'fat', label: 'Fat', value: props.fat, target: props.targets.fat, color: 'bg-fat', text: 'text-fat' },
])
</script>

<template>
  <div class="grid grid-cols-3 gap-3">
    <div v-for="row in rows" :key="row.key" class="flex flex-col gap-1.5">
      <div class="flex items-baseline justify-between">
        <span class="text-xs font-medium text-muted-foreground">{{ row.label }}</span>
      </div>
      <span class="text-sm font-semibold tabular" :class="row.text">
        {{ Math.round(row.value) }}<span class="text-muted-foreground font-normal">/{{ row.target }}g</span>
      </span>
      <Progress :model-value="(row.value / Math.max(1, row.target)) * 100" :indicator-class="row.color" class="h-2" />
    </div>
  </div>
</template>
