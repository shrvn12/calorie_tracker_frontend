<script setup>
import Dialog from '@/components/ui/Dialog.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'

const open = defineModel('open', { type: Boolean, default: false })
const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Delete' },
  cancelLabel: { type: String, default: 'Cancel' },
  danger: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['confirm'])
</script>

<template>
  <Dialog v-model:open="open" :title="title" :description="description">
    <div class="mt-4 flex gap-2">
      <Button variant="outline" class="flex-1" :disabled="loading" @click="open = false">
        {{ cancelLabel }}
      </Button>
      <Button
        :variant="danger ? 'destructive' : 'default'"
        class="flex-1"
        :disabled="loading"
        @click="emit('confirm')"
      >
        <Spinner v-if="loading" class="w-4 h-4" />
        <span>{{ confirmLabel }}</span>
      </Button>
    </div>
  </Dialog>
</template>
