<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Home, CalendarDays, LineChart, User, Flame, UtensilsCrossed } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'
import { useLogStore } from '@/stores/log'

const route = useRoute()
const auth = useAuthStore()
const log = useLogStore()

const tabs = [
  { name: 'dashboard', label: 'Today', icon: Home },
  { name: 'calendar', label: 'Calendar', icon: CalendarDays },
  { name: 'progress', label: 'Progress', icon: LineChart },
  { name: 'profile', label: 'Profile', icon: User },
]

const initials = computed(() =>
  (auth.user?.name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join(''),
)
</script>

<template>
  <aside class="sticky top-0 h-screen w-64 shrink-0 flex-col justify-between border-r border-border bg-card px-4 py-6">
    <div>
      <div class="mb-8 flex items-center gap-2 px-2">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
          <UtensilsCrossed class="h-5 w-5 text-primary" />
        </div>
        <span class="text-lg font-bold text-foreground">Plate</span>
      </div>

      <nav class="flex flex-col gap-1">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.name"
          :to="{ name: tab.name }"
          class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
          :class="route.name === tab.name ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'"
        >
          <component :is="tab.icon" class="h-5 w-5" :stroke-width="route.name === tab.name ? 2.4 : 2" />
          {{ tab.label }}
        </RouterLink>
      </nav>

      <RouterLink
        v-if="log.streak > 0"
        :to="{ name: 'calendar' }"
        class="mt-4 flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2.5 text-primary transition-colors hover:bg-primary/15"
      >
        <Flame class="h-4 w-4 fill-primary" />
        <span class="text-sm font-semibold">{{ log.streak }}-day streak</span>
      </RouterLink>
    </div>

    <div class="flex items-center gap-2.5 border-t border-border px-2 pt-4">
      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
        {{ initials || '?' }}
      </div>
      <div class="min-w-0">
        <p class="truncate text-sm font-medium text-foreground">{{ auth.user?.name }}</p>
        <p class="truncate text-xs text-muted-foreground">{{ auth.user?.email }}</p>
      </div>
    </div>
  </aside>
</template>
