<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { TrendingUp } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'
import { useLogStore } from '@/stores/log'
import { addDaysToKey, todayKey, shortDateLabel } from '@/utils/date'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import TrendBarChart from '@/components/charts/TrendBarChart.vue'
import MacroDonutChart from '@/components/charts/MacroDonutChart.vue'
import WeightTrendChart from '@/components/charts/WeightTrendChart.vue'

const auth = useAuthStore()
const log = useLogStore()

const period = ref('7')
const periodOptions = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
]

function load() {
  const days = Number(period.value)
  const start = addDaysToKey(todayKey(), -(days - 1))
  log.loadRangeSummaries(start, todayKey())
}

onMounted(() => {
  load()
  auth.fetchWeightHistory()
})
watch(period, load)

const labels = computed(() => log.rangeSummaries.map((s) => shortDateLabel(s.dateKey)))
const calorieValues = computed(() => log.rangeSummaries.map((s) => s.calories))
const waterValues = computed(() => log.rangeSummaries.map((s) => s.waterMl))

const daysWithData = computed(() => Math.max(1, log.rangeSummaries.length))
const avgProtein = computed(() => log.rangeSummaries.reduce((s, d) => s + d.protein, 0) / daysWithData.value)
const avgCarbs = computed(() => log.rangeSummaries.reduce((s, d) => s + d.carbs, 0) / daysWithData.value)
const avgFat = computed(() => log.rangeSummaries.reduce((s, d) => s + d.fat, 0) / daysWithData.value)
const hasAnyFoodData = computed(() => log.rangeSummaries.some((d) => d.calories > 0))

const weightHistory = computed(() => auth.weightHistory)
const weightLabels = computed(() => weightHistory.value.map((w) => shortDateLabel(w.dateKey)))
const weightValues = computed(() => weightHistory.value.map((w) => w.weightKg))
</script>

<template>
  <div class="flex flex-col gap-4">
    <SegmentedControl v-model="period" :options="periodOptions" class="lg:max-w-xs" />

    <div class="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6">
      <Card>
        <CardHeader><CardTitle>Calories</CardTitle></CardHeader>
        <CardContent>
          <Skeleton v-if="log.isLoadingRange" class="h-44 w-full" />
          <template v-else-if="hasAnyFoodData">
            <TrendBarChart :labels="labels" :values="calorieValues" :target="auth.targets.calories" bar-color="#f2994a" />
          </template>
          <EmptyState v-else :icon="TrendingUp" title="No food logged in this period" description="Log a few days to see your calorie trend." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Water</CardTitle></CardHeader>
        <CardContent>
          <Skeleton v-if="log.isLoadingRange" class="h-44 w-full" />
          <TrendBarChart v-else :labels="labels" :values="waterValues" :target="auth.targets.waterMl" bar-color="#4fa8d8" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Macros · daily average</CardTitle></CardHeader>
        <CardContent>
          <Skeleton v-if="log.isLoadingRange" class="h-32 w-full" />
          <MacroDonutChart v-else-if="hasAnyFoodData" :protein="avgProtein" :carbs="avgCarbs" :fat="avgFat" />
          <p v-else class="text-sm text-muted-foreground py-2">Not enough data yet.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Weight</CardTitle></CardHeader>
        <CardContent>
          <WeightTrendChart v-if="weightHistory.length >= 2" :labels="weightLabels" :values="weightValues" />
          <p v-else-if="weightHistory.length === 1" class="text-sm text-muted-foreground py-2">
            Current weight is <span class="font-semibold text-foreground">{{ weightHistory[0].weightKg }}kg</span>.
            Log an update from Profile to see a trend here.
          </p>
          <EmptyState v-else :icon="TrendingUp" title="No weight logged yet" description="Add a weight update from your Profile page." />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
