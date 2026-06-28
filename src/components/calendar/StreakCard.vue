<script setup>
import { computed } from 'vue'
import { Flame } from '@lucide/vue'

const props = defineProps({
  streak: { type: Number, default: 0 },
})

const message = computed(() => {
  if (props.streak === 0) return 'Log today to start a streak.'
  if (props.streak === 1) return "You're warming up — log tomorrow to keep it alive."
  return "You're on a roll. Keep showing up."
})
</script>

<template>
  <div class="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
    <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15">
      <Flame class="h-6 w-6 text-primary" :class="streak > 0 ? 'fill-primary' : ''" />
    </div>
    <div>
      <p class="text-xl font-bold tabular text-foreground">{{ streak }} day{{ streak === 1 ? '' : 's' }}</p>
      <p class="text-xs text-muted-foreground">{{ message }}</p>
    </div>
  </div>
</template>
