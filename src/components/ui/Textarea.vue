<script setup>
import { cn } from '@/lib/utils'

defineProps({
  class: { type: String, default: '' },
})
const model = defineModel()
</script>

<template>
  <textarea
    v-model="model"
    :class="cn(
      'flex w-full rounded-xl border border-input bg-card px-3.5 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/70 transition-colors resize-none',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      $props.class,
    )"
  />
</template>
