import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { todayKey, addDaysToKey, buildMonthGrid, isFutureKey } from '@/utils/date'

let localId = 0
function tempId() {
  return `temp-${++localId}-${Date.now()}`
}

export const useLogStore = defineStore('log', () => {
  const selectedDateKey = ref(todayKey())
  const entries = ref([])
  const water = ref([])

  const isLoadingDay = ref(true)
  const isSendingText = ref(false)
  const isSendingImage = ref(false)
  const isAddingWater = ref(false)
  const streak = ref(0)

  const monthStatusMap = ref({})
  const isLoadingCalendar = ref(false)

  const rangeSummaries = ref([])
  const isLoadingRange = ref(false)

  function authUser() {
    return useAuthStore().user
  }

  const daySummary = computed(() => ({
    calories: entries.value.filter((e) => !e.pending).reduce((s, e) => s + e.calories, 0),
    protein: entries.value.filter((e) => !e.pending).reduce((s, e) => s + e.protein, 0),
    carbs: entries.value.filter((e) => !e.pending).reduce((s, e) => s + e.carbs, 0),
    fat: entries.value.filter((e) => !e.pending).reduce((s, e) => s + e.fat, 0),
    waterMl: water.value.reduce((s, w) => s + w.ml, 0),
  }))

  const canGoNext = computed(() => !isFutureKey(addDaysToKey(selectedDateKey.value, 1)))

  async function refreshStreak() {
    const user = authUser()
    if (user) {
      try {
        streak.value = await api.getStreak(user.id)
      } catch (e) {
        console.error(e)
      }
    }
  }

  async function selectDate(dateKey) {
    selectedDateKey.value = dateKey
    await loadDay()
  }

  function goToPreviousDay() {
    return selectDate(addDaysToKey(selectedDateKey.value, -1))
  }

  function goToNextDay() {
    const next = addDaysToKey(selectedDateKey.value, 1)
    if (isFutureKey(next)) return
    return selectDate(next)
  }

  function goToToday() {
    return selectDate(todayKey())
  }

  async function loadDay() {
    const user = authUser()
    if (!user) return
    isLoadingDay.value = true
    try {
      const [dayEntries, dayWater] = await Promise.all([
        api.getEntries(user.id, selectedDateKey.value),
        api.getWater(user.id, selectedDateKey.value),
      ])
      entries.value = dayEntries
      water.value = dayWater
    } catch (e) {
      console.error(e)
    } finally {
      isLoadingDay.value = false
    }
    await refreshStreak()
  }

  // ----------------------------------------------------------- food log --

  async function addFoodText(text) {
    const user = authUser()
    const dateKey = selectedDateKey.value
    const pending = {
      id: tempId(),
      dateKey,
      source: 'text',
      input: text,
      name: text,
      pending: true,
      createdAt: new Date().toISOString(),
    }
    entries.value.push(pending)
    isSendingText.value = true
    try {
      const entry = await api.logFoodFromText(user.id, dateKey, text)
      const idx = entries.value.findIndex((e) => e.id === pending.id)
      if (idx !== -1) entries.value.splice(idx, 1, entry)
      await refreshStreak()
      return entry
    } catch (e) {
      const idx = entries.value.findIndex((e) => e.id === pending.id)
      if (idx !== -1) entries.value.splice(idx, 1, { ...pending, pending: false, failed: true, errorMessage: e.message })
      throw e
    } finally {
      isSendingText.value = false
    }
  }

  async function addFoodImage(file) {
    const user = authUser()
    const dateKey = selectedDateKey.value
    const previewUrl = URL.createObjectURL(file)
    const pending = {
      id: tempId(),
      dateKey,
      source: 'image',
      imageDataUrl: previewUrl,
      name: 'Analyzing photo…',
      pending: true,
      createdAt: new Date().toISOString(),
      // Store the original file for potential retries
      file,
    }
    entries.value.push(pending)
    isSendingImage.value = true
    try {
      const entry = await api.logFoodFromImage(user.id, dateKey, file)
      const idx = entries.value.findIndex((e) => e.id === pending.id)
      if (idx !== -1) entries.value.splice(idx, 1, entry)
      await refreshStreak()
      return entry
    } catch (e) {
      const idx = entries.value.findIndex((e) => e.id === pending.id)
      if (idx !== -1) {
        entries.value.splice(idx, 1, { ...pending, pending: false, failed: true, errorMessage: e.message })
      }
      throw e
    } finally {
      isSendingImage.value = false
      URL.revokeObjectURL(previewUrl)
    }
  }

  function removeFailedEntry(id) {
    entries.value = entries.value.filter((e) => e.id !== id)
  }

  async function updateEntry(id, patch) {
    const user = authUser()
    const updated = await api.updateFoodEntry(user.id, id, patch)
    const idx = entries.value.findIndex((e) => e.id === id)
    if (idx !== -1) entries.value.splice(idx, 1, updated)
    return updated
  }

  async function deleteEntry(id) {
    const user = authUser()
    if (id.toString().startsWith('temp-')) {
      removeFailedEntry(id)
      return
    }
    await api.deleteFoodEntry(user.id, id)
    entries.value = entries.value.filter((e) => e.id !== id)
    await refreshStreak()
  }

  // -------------------------------------------------------------- water --

  async function addWaterMl(ml) {
    const user = authUser()
    isAddingWater.value = true
    try {
      const entry = await api.addWater(user.id, selectedDateKey.value, ml)
      water.value.push(entry)
      return entry
    } finally {
      isAddingWater.value = false
    }
  }

  async function deleteWaterEntry(id) {
    const user = authUser()
    await api.deleteWaterEntry(user.id, id)
    water.value = water.value.filter((w) => w.id !== id)
  }

  // ----------------------------------------------------------- calendar --

  async function loadMonth(year, month) {
    const user = authUser()
    if (!user) return
    isLoadingCalendar.value = true

    try {
      const calendarData = await api.getCalendar(year, month)
      const days = calendarData.days || {}
      const cells = buildMonthGrid(year, month)
      const map = {}
      for (const key of cells) {
        if (!key) continue
        const summary = days[key]
        let status = 'none'
        let calories = 0
        if (summary && summary.totalCalories > 0) {
          calories = summary.totalCalories
          status = summary.metCalorieGoal ? 'goal-met' : 'logged'
        }
        map[key] = { status, calories }
      }
      monthStatusMap.value = map
    } catch (e) {
      console.error(e)
    } finally {
      isLoadingCalendar.value = false
      await refreshStreak()
    }
  }

  // ------------------------------------------------------------- ranges --

  async function loadRangeSummaries(startKey, endKey) {
    const user = authUser()
    if (!user) return
    isLoadingRange.value = true

    try {
      const promises = []
      let cursor = startKey
      while (cursor <= endKey) {
        const current = cursor
        promises.push(
          api.getDaySummary(user.id, current).then((summary) => ({
            dateKey: current,
            ...summary,
          })),
        )
        cursor = addDaysToKey(cursor, 1)
      }
      const summaries = await Promise.all(promises)
      rangeSummaries.value = summaries
      return summaries
    } catch (e) {
      console.error(e)
    } finally {
      isLoadingRange.value = false
    }
  }

  return {
    selectedDateKey,
    entries,
    water,
    daySummary,
    isLoadingDay,
    isSendingText,
    isSendingImage,
    isAddingWater,
    streak,
    canGoNext,
    monthStatusMap,
    isLoadingCalendar,
    rangeSummaries,
    isLoadingRange,
    selectDate,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    loadDay,
    addFoodText,
    addFoodImage,
    removeFailedEntry,
    updateEntry,
    deleteEntry,
    addWaterMl,
    deleteWaterEntry,
    loadMonth,
    loadRangeSummaries,
    refreshStreak,
  }
})
