<script setup>
import {
  SelectRoot, SelectTrigger, SelectValue, SelectIcon, SelectPortal,
  SelectContent, SelectViewport, SelectItem, SelectItemText, SelectItemIndicator,
} from 'reka-ui'
import { ChevronDown, Check } from '@lucide/vue'
import { cn } from '@/lib/utils'

const model = defineModel()
defineProps({
  options: { type: Array, required: true }, // [{ value, label }]
  placeholder: { type: String, default: 'Select…' },
  class: { type: String, default: '' },
})
</script>

<template>
  <SelectRoot v-model="model">
    <SelectTrigger
      :class="cn(
        'flex h-12 w-full items-center justify-between rounded-xl border border-input bg-card px-3.5 text-[15px] text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        $props.class,
      )"
    >
      <SelectValue :placeholder="placeholder" />
      <SelectIcon><ChevronDown class="h-4 w-4 text-muted-foreground" /></SelectIcon>
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        class="z-50 overflow-hidden rounded-xl border border-border bg-popover shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        position="popper"
        :side-offset="6"
      >
        <SelectViewport class="p-1 max-h-64">
          <SelectItem
            v-for="opt in options"
            :key="opt.value"
            :value="opt.value"
            class="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm text-foreground outline-none data-[highlighted]:bg-accent"
          >
            <SelectItemText>{{ opt.label }}</SelectItemText>
            <SelectItemIndicator class="absolute right-3">
              <Check class="h-4 w-4 text-primary" />
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
