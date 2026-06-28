<script setup>
import { cn } from '@/lib/utils'

defineProps({
  class: { type: String, default: '' },
  invalid: { type: Boolean, default: false },
})
const model = defineModel()
</script>

<template>
  <input
    v-model="model"
    :class="cn(
      'flex h-12 w-full rounded-xl border bg-card px-3.5 text-[15px] text-foreground placeholder:text-muted-foreground/70 transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
      invalid ? 'border-destructive' : 'border-input',
      $attrs.disabled ? 'opacity-50' : '',
      $props.class,
    )"
  />
</template>
