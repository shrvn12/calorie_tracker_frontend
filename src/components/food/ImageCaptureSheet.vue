<script setup>
import { ref } from 'vue'
import { Camera, ImageUp } from '@lucide/vue'
import Sheet from '@/components/ui/Sheet.vue'

const open = defineModel('open', { type: Boolean, default: false })
const emit = defineEmits(['select'])

const cameraInput = ref(null)
const libraryInput = ref(null)

function onFile(e) {
  const file = e.target.files?.[0]
  e.target.value = ''
  if (!file) return
  open.value = false
  emit('select', file)
}
</script>

<template>
  <Sheet v-model:open="open" title="Add a photo">
    <div class="mt-3 grid grid-cols-2 gap-3">
      <button
        type="button"
        class="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card py-5 active:scale-[0.98] transition"
        @click="cameraInput.click()"
      >
        <div class="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15">
          <Camera class="h-5 w-5 text-primary" />
        </div>
        <span class="text-sm font-medium text-foreground">Take photo</span>
      </button>
      <button
        type="button"
        class="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card py-5 active:scale-[0.98] transition"
        @click="libraryInput.click()"
      >
        <div class="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15">
          <ImageUp class="h-5 w-5 text-primary" />
        </div>
        <span class="text-sm font-medium text-foreground">Upload photo</span>
      </button>
    </div>

    <input ref="cameraInput" type="file" accept="image/*" capture="environment" class="hidden" @change="onFile" />
    <input ref="libraryInput" type="file" accept="image/*" class="hidden" @change="onFile" />
  </Sheet>
</template>
