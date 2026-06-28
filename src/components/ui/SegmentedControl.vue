<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  options: { type: Array, required: true }, // [{ value, label, hint? }]
  class: { type: String, default: '' },
  columns: { type: Number, default: 0 }, // 0 = auto (equal flex columns)
})
const model = defineModel()
</script>

<template>
  <div
    :class="cn('grid gap-2', props.class)"
    :style="columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : { gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }"
  >
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      @click="model = opt.value"
      :class="cn(
        'flex flex-col items-center justify-center gap-0.5 rounded-xl border px-2 py-3 text-sm font-medium transition-colors',
        model === opt.value
          ? 'border-primary bg-primary/15 text-primary'
          : 'border-border bg-card text-foreground/80 hover:bg-accent',
      )"
    >
      <span>{{ opt.label }}</span>
      <span v-if="opt.hint" class="text-[11px] font-normal text-muted-foreground">{{ opt.hint }}</span>
    </button>
  </div>
</template>
