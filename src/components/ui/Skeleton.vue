<script setup>
import { cn } from '@/lib/utils'
const props = defineProps({ class: { type: String, default: '' } })
</script>
<template>
  <div :class="cn('animate-pulse rounded-xl bg-muted', props.class)" />
</template>
