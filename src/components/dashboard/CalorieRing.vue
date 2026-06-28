<script setup>
import { computed } from 'vue'

const props = defineProps({
  consumed: { type: Number, default: 0 },
  target: { type: Number, default: 2000 },
  size: { type: Number, default: 188 },
})

const stroke = 14
const radius = computed(() => (props.size - stroke) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const percent = computed(() => Math.min(100, (props.consumed / Math.max(1, props.target)) * 100))
const offset = computed(() => circumference.value - (percent.value / 100) * circumference.value)
const remaining = computed(() => props.target - props.consumed)
const isOver = computed(() => remaining.value < 0)
</script>

<template>
  <div class="relative inline-flex items-center justify-center" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" class="-rotate-90">
      <circle :cx="size / 2" :cy="size / 2" :r="radius" fill="none" :stroke-width="stroke" class="text-muted" stroke="currentColor" />
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke-width="stroke"
        stroke-linecap="round"
        :class="isOver ? 'text-destructive' : 'text-primary'"
        stroke="currentColor"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        class="transition-[stroke-dashoffset] duration-700 ease-out"
      />
    </svg>
    <div class="absolute flex flex-col items-center">
      <span class="text-3xl font-bold tabular text-foreground">{{ Math.abs(Math.round(remaining)) }}</span>
      <span class="text-xs font-medium" :class="isOver ? 'text-destructive' : 'text-muted-foreground'">
        kcal {{ isOver ? 'over' : 'left' }}
      </span>
    </div>
  </div>
</template>
