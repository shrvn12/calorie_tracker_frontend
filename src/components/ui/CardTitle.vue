<script setup>
import { cn } from '@/lib/utils'
const props = defineProps({ class: { type: String, default: '' } })
</script>
<template>
  <h3 :class="cn('font-semibold leading-tight', props.class)"><slot /></h3>
</template>
