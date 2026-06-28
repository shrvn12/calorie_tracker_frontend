<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { Flame } from '@lucide/vue'
import { useLogStore } from '@/stores/log'

const route = useRoute()
const log = useLogStore()

const titles = {
  dashboard: 'Today',
  calendar: 'Calendar',
  progress: 'Progress',
  profile: 'Profile',
}

const title = computed(() => titles[route.name] || 'Plate')
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
    <div class="mx-auto flex max-w-md items-center justify-between px-4 py-3.5">
      <h1 class="text-lg font-semibold text-foreground">{{ title }}</h1>
      <RouterLink
        v-if="log.streak > 0"
        :to="{ name: 'calendar' }"
        class="flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-primary"
      >
        <Flame class="h-4 w-4 fill-primary" />
        <span class="text-sm font-semibold tabular">{{ log.streak }}</span>
      </RouterLink>
    </div>
  </header>
</template>
