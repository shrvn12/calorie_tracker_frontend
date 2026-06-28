<script setup>
import { ref, computed } from 'vue'
import { Droplet, Plus } from '@lucide/vue'
import { useLogStore } from '@/stores/log'
import { useToast } from '@/composables/useToast'
import Progress from '@/components/ui/Progress.vue'
import Button from '@/components/ui/Button.vue'
import Dialog from '@/components/ui/Dialog.vue'
import Input from '@/components/ui/Input.vue'
import Spinner from '@/components/ui/Spinner.vue'

const props = defineProps({
  targetMl: { type: Number, required: true },
})

const log = useLogStore()
const toast = useToast()

const totalMl = computed(() => log.water.reduce((s, w) => s + w.ml, 0))
const percent = computed(() => (totalMl.value / Math.max(1, props.targetMl)) * 100)

const pendingAmount = ref(null) // 250 | 500 while that quick-add button is loading

async function quickAdd(ml) {
  pendingAmount.value = ml
  try {
    await log.addWaterMl(ml)
  } catch {
    toast.error("Couldn't log that, try again.")
  } finally {
    pendingAmount.value = null
  }
}

const editing = ref(null) // { id, ml } | null
const editAmount = ref('')
const isSavingEdit = ref(false)
const isDeleting = ref(false)
const editingOpen = computed({
  get: () => editing.value !== null,
  set: (v) => {
    if (!v) editing.value = null
  },
})

function openEdit(entry) {
  editing.value = entry
  editAmount.value = String(entry.ml)
}

async function saveEdit() {
  const ml = Number(editAmount.value)
  if (!ml || ml <= 0) return
  isSavingEdit.value = true
  try {
    await log.deleteWaterEntry(editing.value.id)
    await log.addWaterMl(ml)
    editing.value = null
  } catch {
    toast.error("Couldn't update that entry.")
  } finally {
    isSavingEdit.value = false
  }
}

async function deleteEdit() {
  isDeleting.value = true
  try {
    await log.deleteWaterEntry(editing.value.id)
    editing.value = null
  } catch {
    toast.error("Couldn't remove that entry.")
  } finally {
    isDeleting.value = false
  }
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-1.5 text-sm font-medium text-foreground">
        <Droplet class="h-4 w-4 text-water" />
        <span>Water</span>
      </div>
      <span class="text-sm tabular text-muted-foreground">{{ totalMl }} / {{ targetMl }} ml</span>
    </div>

    <Progress :model-value="percent" indicator-class="bg-water" class="h-2 mb-3" />

    <div class="flex gap-2 mb-2">
      <Button variant="outline" size="sm" :disabled="pendingAmount !== null" @click="quickAdd(250)">
        <Spinner v-if="pendingAmount === 250" class="w-3.5 h-3.5" />
        <Plus v-else class="h-3.5 w-3.5" />
        <span>250 ml</span>
      </Button>
      <Button variant="outline" size="sm" :disabled="pendingAmount !== null" @click="quickAdd(500)">
        <Spinner v-if="pendingAmount === 500" class="w-3.5 h-3.5" />
        <Plus v-else class="h-3.5 w-3.5" />
        <span>500 ml</span>
      </Button>
    </div>

    <div v-if="log.water.length" class="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
      <button
        v-for="w in log.water"
        :key="w.id"
        class="shrink-0 rounded-full bg-water/15 px-3 py-1 text-xs font-medium text-water"
        @click="openEdit(w)"
      >
        {{ w.ml }}ml · {{ formatTime(w.createdAt) }}
      </button>
    </div>

    <Dialog v-model:open="editingOpen" title="Edit water entry">
      <template v-if="editing">
        <div class="mt-3">
          <Input v-model="editAmount" type="number" inputmode="numeric" placeholder="ml" />
        </div>
        <div class="mt-4 flex gap-2">
          <Button variant="destructive" class="flex-1" :disabled="isDeleting || isSavingEdit" @click="deleteEdit">
            <Spinner v-if="isDeleting" class="w-4 h-4" />
            <span>Delete</span>
          </Button>
          <Button class="flex-1" :disabled="isDeleting || isSavingEdit" @click="saveEdit">
            <Spinner v-if="isSavingEdit" class="w-4 h-4" />
            <span>Save</span>
          </Button>
        </div>
      </template>
    </Dialog>
  </div>
</template>
