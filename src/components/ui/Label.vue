<script setup>
import { Label as LabelRoot } from 'reka-ui'
import { cn } from '@/lib/utils'
const props = defineProps({ class: { type: String, default: '' }, for: { type: String, default: undefined } })
</script>
<template>
  <LabelRoot :for="props.for" :class="cn('text-sm font-medium text-foreground/90 mb-1.5 block', props.class)">
    <slot />
  </LabelRoot>
</template>
