<script setup>
import { AvatarRoot, AvatarFallback } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps({
  name: { type: String, default: '' },
  class: { type: String, default: '' },
})

const initials = (props.name || '?')
  .trim()
  .split(/\s+/)
  .slice(0, 2)
  .map((w) => w[0]?.toUpperCase())
  .join('')
</script>

<template>
  <AvatarRoot :class="cn('inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-primary font-semibold', props.class)">
    <AvatarFallback>{{ initials || '?' }}</AvatarFallback>
  </AvatarRoot>
</template>
