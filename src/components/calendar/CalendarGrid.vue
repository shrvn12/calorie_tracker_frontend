<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight, Check } from '@lucide/vue'
import { buildMonthGrid, weekdayHeaders, monthLabel, fromKey, isFutureKey, isTodayKey } from '@/utils/date'
import Skeleton from '@/components/ui/Skeleton.vue'

const props = defineProps({
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  statusMap: { type: Object, default: () => ({}) },
  isLoading: { type: Boolean, default: false },
})
const emit = defineEmits(['prev', 'next', 'select-day'])

const cells = computed(() => buildMonthGrid(props.year, props.month))
const headers = weekdayHeaders()

function dayNumber(key) {
  return fromKey(key).getDate()
}

function statusFor(key) {
  return props.statusMap[key]?.status || 'none'
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <button class="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-accent" @click="emit('prev')">
        <ChevronLeft class="h-4 w-4" />
      </button>
      <span class="text-sm font-semibold text-foreground">{{ monthLabel(year, month) }}</span>
      <button class="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-accent" @click="emit('next')">
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>

    <div class="grid grid-cols-7 gap-y-1.5 text-center lg:gap-y-2.5">
      <span v-for="h in headers" :key="h" class="text-[11px] font-medium text-muted-foreground lg:text-xs">{{ h }}</span>

      <template v-if="isLoading">
        <Skeleton v-for="i in cells.length" :key="i" class="mx-auto h-9 w-9 rounded-full lg:h-12 lg:w-12" />
      </template>
      <template v-else>
        <div v-for="(key, i) in cells" :key="key || `blank-${i}`" class="flex items-center justify-center">
          <button
            v-if="key"
            type="button"
            :disabled="isFutureKey(key)"
            @click="emit('select-day', key)"
            class="relative flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors disabled:opacity-30 lg:h-12 lg:w-12 lg:text-base lg:hover:scale-105"
            :class="[
              statusFor(key) === 'goal-met' ? 'bg-success/20 text-success' :
              statusFor(key) === 'logged' ? 'bg-primary/15 text-primary' :
              'text-foreground/70 hover:bg-accent',
              isTodayKey(key) ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : '',
            ]"
          >
            <Check v-if="statusFor(key) === 'goal-met'" class="h-4 w-4" />
            <span v-else>{{ dayNumber(key) }}</span>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
