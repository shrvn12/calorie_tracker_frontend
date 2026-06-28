<script setup>
import { DialogRoot, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose } from 'reka-ui'
import { X } from '@lucide/vue'
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
          'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-5 shadow-2xl',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          $props.class,
        )"
      >
        <div class="flex items-start justify-between gap-3 mb-1">
          <div>
            <DialogTitle v-if="title" class="text-base font-semibold text-foreground">{{ title }}</DialogTitle>
            <DialogDescription v-if="description" class="text-sm text-muted-foreground mt-0.5">{{ description }}</DialogDescription>
          </div>
          <DialogClose class="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground shrink-0">
            <X class="h-4 w-4" />
          </DialogClose>
        </div>
        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
