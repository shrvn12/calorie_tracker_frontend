<script setup>
import { cva } from 'class-variance-authority'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  variant: { type: String, default: 'default' }, // default | secondary | success | destructive | outline
  class: { type: String, default: '' },
})

const variants = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium gap-1', {
  variants: {
    variant: {
      default: 'bg-primary/15 text-primary',
      secondary: 'bg-secondary text-secondary-foreground',
      success: 'bg-success/15 text-success',
      destructive: 'bg-destructive/15 text-destructive',
      outline: 'border border-border text-muted-foreground',
    },
  },
  defaultVariants: { variant: 'default' },
})

const classes = computed(() => cn(variants({ variant: props.variant }), props.class))
</script>
<template>
  <span :class="classes"><slot /></span>
</template>
