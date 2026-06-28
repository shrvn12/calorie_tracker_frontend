<script setup>
defineProps({
  icon: { type: [Object, Function], default: null },
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 py-10 px-6 text-center">
    <div v-if="icon" class="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
      <component :is="icon" class="h-6 w-6 text-muted-foreground" />
    </div>
    <h3 class="text-[15px] font-semibold text-foreground">{{ title }}</h3>
    <p v-if="description" class="max-w-xs text-sm text-muted-foreground">{{ description }}</p>
    <div v-if="$slots.action" class="mt-2">
      <slot name="action" />
    </div>
  </div>
</template>
