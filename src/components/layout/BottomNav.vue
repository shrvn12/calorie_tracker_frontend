<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { Home, CalendarDays, LineChart, User } from '@lucide/vue'

const route = useRoute()

const tabs = [
  { name: 'dashboard', label: 'Today', icon: Home },
  { name: 'calendar', label: 'Calendar', icon: CalendarDays },
  { name: 'progress', label: 'Progress', icon: LineChart },
  { name: 'profile', label: 'Profile', icon: User },
]
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur safe-bottom"
    aria-label="Primary"
  >
    <div class="mx-auto flex max-w-md items-stretch justify-between px-2">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.name"
        :to="{ name: tab.name }"
        class="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors"
        :class="route.name === tab.name ? 'text-primary' : 'text-muted-foreground'"
      >
        <component :is="tab.icon" class="h-5 w-5" :stroke-width="route.name === tab.name ? 2.4 : 2" />
        <span>{{ tab.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
