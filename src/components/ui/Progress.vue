<script setup>
import { ProgressRoot, ProgressIndicator } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps({
  modelValue: { type: Number, default: 0 }, // 0-100
  class: { type: String, default: '' },
  indicatorClass: { type: String, default: 'bg-primary' },
})
</script>

<template>
  <ProgressRoot
    :model-value="Math.min(100, Math.max(0, modelValue))"
    :class="cn('relative h-2.5 w-full overflow-hidden rounded-full bg-muted', props.class)"
  >
    <ProgressIndicator
      :class="cn('h-full w-full flex-1 rounded-full transition-transform duration-500 ease-out', indicatorClass)"
      :style="{ transform: `translateX(-${100 - Math.min(100, Math.max(0, modelValue))}%)` }"
    />
  </ProgressRoot>
</template>
