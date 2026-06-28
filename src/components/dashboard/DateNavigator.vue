<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { useLogStore } from '@/stores/log'
import { displayLabel, isTodayKey } from '@/utils/date'

const log = useLogStore()
const label = computed(() => displayLabel(log.selectedDateKey))
const onToday = computed(() => isTodayKey(log.selectedDateKey))
</script>

<template>
  <div class="flex items-center justify-between">
    <button
      type="button"
      class="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:bg-accent active:scale-95 transition"
      aria-label="Previous day"
      @click="log.goToPreviousDay()"
    >
      <ChevronLeft class="h-5 w-5" />
    </button>

    <button
      v-if="!onToday"
      type="button"
      class="text-base font-semibold text-foreground"
      @click="log.goToToday()"
    >
      {{ label }}
      <span class="ml-1 text-xs font-medium text-primary">· Today</span>
    </button>
    <span v-else class="text-base font-semibold text-foreground">{{ label }}</span>

    <button
      type="button"
      class="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:bg-accent active:scale-95 transition disabled:opacity-30 disabled:pointer-events-none"
      aria-label="Next day"
      :disabled="!log.canGoNext"
      @click="log.goToNextDay()"
    >
      <ChevronRight class="h-5 w-5" />
    </button>
  </div>
</template>
