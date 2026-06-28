<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { useLogStore } from '@/stores/log'
import { useToast } from '@/composables/useToast'
import { UtensilsCrossed } from '@lucide/vue'
import FoodEntryCard from '@/components/food/FoodEntryCard.vue'
import EditEntryDialog from '@/components/food/EditEntryDialog.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import Skeleton from '@/components/ui/Skeleton.vue'

const log = useLogStore();
const toast = useToast();
const editingEntry = ref(null)
const isEditOpen = ref(false)
const deleteTarget = ref(null)
const isConfirmOpen = ref(false)
const isDeleting = ref(false)

const entries = computed(() => log.entries)
const feedContainer = ref(null)
watch(entries, async () => {
  await nextTick()
  if (feedContainer.value) {
    feedContainer.value.scrollTop = feedContainer.value.scrollHeight
  }
}, { deep: true })

function openEdit(entry) {
  editingEntry.value = entry
  isEditOpen.value = true
}

function requestDelete(id) {
  const entry = entries.value.find((e) => e.id === id)
  if (entry?.failed) {
    log.deleteEntry(id)
    return
  }
  deleteTarget.value = id
  isConfirmOpen.value = true
}

async function confirmDelete() {
  isDeleting.value = true
  try {
    await log.deleteEntry(deleteTarget.value)
    toast.success('Entry removed.')
    isConfirmOpen.value = false
  } catch {
    toast.error("Couldn't remove that entry.")
  } finally {
    isDeleting.value = false
  }
}

async function handleRetry(entry) {
  log.removeFailedEntry(entry.id)
  try {
    if (entry.source === 'image' && entry.file) {
      await log.addFoodImage(entry.file)
    } else {
      await log.addFoodText(entry.input)
    }
  } catch {
    toast.error('Still having trouble reading that.')
  }
}
</script>

<template>
  <div ref="feedContainer" class="flex flex-col gap-4 overflow-y-auto">
    <template v-if="log.isLoadingDay">
      <div v-for="i in 3" :key="i" class="flex flex-col gap-1.5">
        <div class="flex justify-end"><Skeleton class="h-10 w-2/3" /></div>
        <div class="flex justify-start"><Skeleton class="h-16 w-3/4" /></div>
      </div>
    </template>

    <EmptyState
      v-else-if="entries.length === 0"
      :icon="UtensilsCrossed"
      title="Nothing logged yet"
      description="Type what you ate or snap a photo below to get started."
    />

    <FoodEntryCard
      v-for="entry in entries"
      :key="entry.id"
      :entry="entry"
      @edit="openEdit"
      @delete="requestDelete"
      @retry="handleRetry"
    />

    <EditEntryDialog v-model:open="isEditOpen" :entry="editingEntry" />

    <ConfirmDialog
      v-model:open="isConfirmOpen"
      title="Remove this entry?"
      description="This will take it out of today's log for good."
      confirm-label="Remove"
      :loading="isDeleting"
      @confirm="confirmDelete"
    />
  </div>
</template>
