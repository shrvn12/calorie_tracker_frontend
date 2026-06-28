<script setup>
import { computed } from 'vue'
import { Camera, Pencil, Trash2, Sparkles, RotateCw } from '@lucide/vue'
import { timeLabel } from '@/utils/date'
import Badge from '@/components/ui/Badge.vue'
import TypingIndicator from '@/components/food/TypingIndicator.vue'

const props = defineProps({
  entry: { type: Object, required: true },
})
const emit = defineEmits(['edit', 'delete', 'retry'])

const time = computed(() => timeLabel(new Date(props.entry.loggedAt || props.entry.createdAt || new Date().toISOString())))
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <!-- user message -->
    <div class="flex justify-end">
      <div class="max-w-[78%] rounded-2xl rounded-tr-md bg-primary px-3.5 py-2.5 text-primary-foreground">
        <img
          v-if="entry.source === 'image'"
          :src="entry.imageDataUrl"
          alt=""
          class="mb-1.5 h-36 w-full rounded-lg object-cover"
        />
        <p v-if="entry.source === 'text'" class="text-[15px] leading-snug">{{ entry.input }}</p>
        <p v-else-if="entry.pending" class="flex items-center gap-1.5 text-[13px] opacity-80">
          <Camera class="h-3.5 w-3.5" /> Photo
        </p>
        <span class="mt-1 block text-right text-[11px] opacity-70">{{ time }}</span>
      </div>
    </div>

    <!-- AI reply -->
    <div class="flex justify-start">
      <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary mr-2 mt-auto">
        <Sparkles class="h-3.5 w-3.5 text-primary" />
      </div>

      <div class="max-w-[78%] rounded-2xl rounded-tl-md bg-card border border-border px-3.5 py-2.5">
        <div v-if="entry.pending" class="flex items-center gap-2 py-1 text-muted-foreground">
          <TypingIndicator />
        </div>

        <div v-else-if="entry.failed" class="max-w-[220px]">
          <p class="text-sm text-destructive">{{ entry.errorMessage || "Couldn't read that." }}</p>
          <div class="mt-2 flex gap-3">
            <button v-if="entry.source === 'text' || entry.source === 'image'" class="flex items-center gap-1 text-xs font-semibold text-primary" @click="emit('retry', entry)">
              <RotateCw class="h-3 w-3" /> Try again
            </button>
            <button class="text-xs font-semibold text-muted-foreground" @click="emit('delete', entry.id)">
              Dismiss
            </button>
          </div>
        </div>

        <div v-else>
          <div class="flex items-start justify-between gap-2">
            <p class="text-[15px] font-medium leading-snug text-foreground">{{ entry.name }}</p>
            <div class="flex shrink-0 gap-1 -mr-1 -mt-0.5">
              <button class="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground" @click="emit('edit', entry)" aria-label="Edit entry">
                <Pencil class="h-3.5 w-3.5" />
              </button>
              <button class="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-destructive" @click="emit('delete', entry.id)" aria-label="Delete entry">
                <Trash2 class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div class="mt-1.5 flex items-center gap-1.5">
            <span class="text-lg font-bold tabular text-primary">{{ entry.calories ?? 0 }}</span>
            <span class="text-xs text-muted-foreground">kcal</span>
            <Badge v-if="entry.approximate" variant="outline" class="ml-0.5">estimated</Badge>
          </div>

          <div class="mt-2 flex gap-1.5">
            <span class="rounded-full bg-protein/15 px-2 py-0.5 text-[11px] font-medium text-protein">P {{ entry.protein ?? 0 }}g</span>
            <span class="rounded-full bg-carbs/15 px-2 py-0.5 text-[11px] font-medium text-carbs">C {{ entry.carbs ?? 0 }}g</span>
            <span class="rounded-full bg-fat/15 px-2 py-0.5 text-[11px] font-medium text-fat">F {{ entry.fat ?? 0 }}g</span>
          </div>

          <span class="mt-1.5 block text-[11px] text-muted-foreground">{{ time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
