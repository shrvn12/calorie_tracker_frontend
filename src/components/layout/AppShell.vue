<script setup>
import TopBar from '@/components/layout/TopBar.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import Sidebar from '@/components/layout/Sidebar.vue'

defineProps({
  extraBottomSpace: { type: Boolean, default: false },
})
</script>

<template>
  <div class="min-h-screen bg-background lg:flex">
    <Sidebar class="hidden lg:flex" />

    <div class="min-w-0 flex-1">
      <TopBar class="lg:hidden" />
      <main
        class="mx-auto w-full max-w-md px-4 pt-4 lg:max-w-[1600px] lg:px-10 lg:pt-10"
        :class="extraBottomSpace ? 'pb-40 lg:pb-10' : 'pb-28 lg:pb-10'"
      >
        <slot />
      </main>
    </div>

    <BottomNav class="lg:hidden" />
  </div>
</template>
