<script setup>
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLogStore } from '@/stores/log'
import DateNavigator from '@/components/dashboard/DateNavigator.vue'
import CalorieRing from '@/components/dashboard/CalorieRing.vue'
import MacroSummary from '@/components/dashboard/MacroSummary.vue'
import WaterTracker from '@/components/dashboard/WaterTracker.vue'
import FoodLogFeed from '@/components/food/FoodLogFeed.vue'
import FoodInputBar from '@/components/food/FoodInputBar.vue'
import Card from '@/components/ui/Card.vue'
import Skeleton from '@/components/ui/Skeleton.vue'

const auth = useAuthStore()
const log = useLogStore()

const targets = computed(() => auth.targets)

onMounted(() => {
  log.loadDay()
})
</script>

<template>
  <div class="flex flex-col gap-4 lg:grid lg:grid-cols-[380px_1fr] lg:items-start lg:gap-6">
    <!-- stats column -->
    <div class="flex flex-col gap-4 lg:sticky lg:top-10">
      <DateNavigator />

      <Card class="p-4">
        <div v-if="log.isLoadingDay" class="flex flex-col items-center gap-3 py-2">
          <Skeleton class="h-[188px] w-[188px] rounded-full" />
        </div>
        <template v-else>
          <div class="flex justify-center">
            <CalorieRing :consumed="log.daySummary.calories" :target="targets.calories" />
          </div>
          <p class="mt-2 text-center text-sm text-muted-foreground">
            <span class="font-semibold text-foreground tabular">{{ log.daySummary.calories }}</span> eaten ·
            <span class="tabular">{{ targets.calories }}</span> goal
          </p>

          <div class="mt-5 border-t border-border pt-4">
            <MacroSummary
              :protein="log.daySummary.protein"
              :carbs="log.daySummary.carbs"
              :fat="log.daySummary.fat"
              :targets="targets"
            />
          </div>
        </template>
      </Card>

      <Card class="p-4">
        <div v-if="log.isLoadingDay" class="flex flex-col gap-2">
          <Skeleton class="h-4 w-24" />
          <Skeleton class="h-2 w-full" />
        </div>
        <WaterTracker v-else :target-ml="targets.waterMl" />
      </Card>
    </div>

    <!-- chat / food log column -->
    <div class="flex flex-col lg:h-[calc(100vh-5rem)] lg:overflow-hidden lg:rounded-2xl lg:border lg:border-border lg:bg-card">
      <h2 class="mb-3 text-sm font-semibold text-muted-foreground lg:px-5 lg:pt-5">Food log</h2>
      <div class="lg:flex-1 lg:overflow-y-auto lg:px-5 lg:pb-2">
        <FoodLogFeed />
      </div>
      <FoodInputBar />
    </div>
  </div>
</template>
