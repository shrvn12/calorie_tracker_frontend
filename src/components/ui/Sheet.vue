<script setup>
import { DialogRoot, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription } from 'reka-ui'
import { cn } from '@/lib/utils'

const open = defineModel('open', { type: Boolean, default: false })
defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  class: { type: String, default: '' },
})
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />
      <DialogContent
        :class="cn(
          'fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-border bg-card p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
          $props.class,
        )"
      >
        <div class="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />
        <DialogTitle v-if="title" class="text-base font-semibold text-foreground">{{ title }}</DialogTitle>
        <DialogDescription v-if="description" class="text-sm text-muted-foreground mt-0.5 mb-2">{{ description }}</DialogDescription>
        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
