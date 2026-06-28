<script setup>
import { cn } from '@/lib/utils'
const props = defineProps({ class: { type: String, default: 'w-4 h-4' } })
</script>
<template>
  <svg :class="cn('animate-spin text-current', props.class)" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity="0.2" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
  </svg>
</template>
