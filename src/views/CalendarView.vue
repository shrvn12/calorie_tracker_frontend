<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLogStore } from '@/stores/log'
import StreakCard from '@/components/calendar/StreakCard.vue'
import CalendarGrid from '@/components/calendar/CalendarGrid.vue'

const log = useLogStore()
const router = useRouter()

const now = new Date()
const year = ref(now.getFullYear())
const month = ref(now.getMonth())

function load() {
  log.loadMonth(year.value, month.value)
}

onMounted(load)

function prevMonth() {
  if (month.value === 0) {
    month.value = 11
    year.value -= 1
  } else {
    month.value -= 1
  }
  load()
}

function nextMonth() {
  if (month.value === 11) {
    month.value = 0
    year.value += 1
  } else {
    month.value += 1
  }
  load()
}

async function selectDay(dateKey) {
  await log.selectDate(dateKey)
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <div class="flex flex-col gap-4 lg:grid lg:grid-cols-[300px_1fr] lg:items-start lg:gap-6">
    <div class="flex flex-col gap-4 lg:sticky lg:top-10">
      <StreakCard :streak="log.streak" />

      <div class="hidden flex-col gap-2 rounded-2xl border border-border bg-card p-4 lg:flex">
        <p class="mb-1 text-sm font-semibold text-foreground">Legend</p>
        <span class="flex items-center gap-2 text-sm text-muted-foreground"><span class="h-2.5 w-2.5 rounded-full bg-primary/40" /> Logged</span>
        <span class="flex items-center gap-2 text-sm text-muted-foreground"><span class="h-2.5 w-2.5 rounded-full bg-success/60" /> Goal hit</span>
      </div>
    </div>

    <div>
      <div class="rounded-2xl border border-border bg-card p-4 lg:p-6">
        <CalendarGrid
          :year="year"
          :month="month"
          :status-map="log.monthStatusMap"
          :is-loading="log.isLoadingCalendar"
          @prev="prevMonth"
          @next="nextMonth"
          @select-day="selectDay"
        />
      </div>

      <div class="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground lg:hidden">
        <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-primary/40" /> Logged</span>
        <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-success/60" /> Goal hit</span>
      </div>
    </div>
  </div>
</template>
