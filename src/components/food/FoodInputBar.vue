<script setup>
import { ref } from 'vue'
import { Camera, ArrowUp } from '@lucide/vue'
import { useLogStore } from '@/stores/log'
import { useToast } from '@/composables/useToast'
import Spinner from '@/components/ui/Spinner.vue'
import ImageCaptureSheet from '@/components/food/ImageCaptureSheet.vue'

const log = useLogStore()
const toast = useToast()

const text = ref('')
const isSheetOpen = ref(false)
const inputRef = ref(null)

async function send() {
  const value = text.value.trim()
  if (!value || log.isSendingText) return
  text.value = ''
  try {
    await log.addFoodText(value)
  } catch (e) {
    toast.error(e.message || "Couldn't log that, try again.")
  }
}

async function onImageSelected(file) {
  try {
    await log.addFoodImage(file)
  } catch (e) {
    toast.error(e.message || "Couldn't analyze that photo.")
  }
}

function onEnter(e) {
  if (!e.shiftKey) {
    e.preventDefault()
    send()
  }
}
</script>

<template>
  <div class="fixed inset-x-0 bottom-16 z-40 border-t border-border bg-card/95 backdrop-blur lg:static lg:inset-auto lg:z-auto lg:border-t lg:bg-card lg:backdrop-blur-none">
    <div class="mx-auto max-w-md px-3 py-2.5 lg:max-w-none lg:px-4 lg:py-3">
      <div class="flex items-end gap-2">
        <button
          type="button"
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent hover:text-foreground active:scale-95 transition disabled:opacity-50"
          :disabled="log.isSendingImage"
          aria-label="Add a photo"
          @click="isSheetOpen = true"
        >
          <Spinner v-if="log.isSendingImage" class="h-4 w-4" />
          <Camera v-else class="h-5 w-5" />
        </button>

<textarea
  ref="inputRef"
  v-model="text"
  placeholder="What did you eat?"
  maxlength="140"
  rows="1"
  class="h-11 flex-1 rounded-full border border-input bg-background px-4 py-2 text-[15px] leading-6 text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none overflow-y-auto"
  @keydown.enter="onEnter"
></textarea>

        <button
          type="button"
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground active:scale-95 transition disabled:opacity-40"
          :disabled="!text.trim() || log.isSendingText"
          aria-label="Log this food"
          @click="send"
        >
          <Spinner v-if="log.isSendingText" class="h-4 w-4" />
          <ArrowUp v-else class="h-5 w-5" />
        </button>
      </div>
    </div>

    <ImageCaptureSheet v-model:open="isSheetOpen" @select="onImageSelected" />
  </div>
</template>
