<script setup>
import { CheckCircle2, XCircle, Info, X } from '@lucide/vue'
import { useToastStore } from '@/stores/toast'

const store = useToastStore()

const icons = { success: CheckCircle2, error: XCircle, info: Info }
const colors = {
  success: 'text-success',
  error: 'text-destructive',
  info: 'text-primary',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-x-0 top-0 z-[100] flex flex-col items-center gap-2 p-3 pointer-events-none sm:items-end sm:pr-4">
      <TransitionGroup name="toast">
        <div
          v-for="t in store.toasts"
          :key="t.id"
          class="pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl border border-border bg-popover p-3.5 shadow-2xl"
        >
          <component :is="icons[t.type] || Info" :class="['h-5 w-5 shrink-0 mt-0.5', colors[t.type]]" />
          <p class="flex-1 text-sm text-foreground leading-snug">{{ t.message }}</p>
          <button class="text-muted-foreground hover:text-foreground" @click="store.dismiss(t.id)">
            <X class="h-4 w-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.97);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}
</style>
