<script setup>
import { ref, watch } from 'vue'
import Dialog from '@/components/ui/Dialog.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { useLogStore } from '@/stores/log'
import { useToast } from '@/composables/useToast'

const open = defineModel('open', { type: Boolean, default: false })
const props = defineProps({
  entry: { type: Object, default: null },
})

const log = useLogStore()
const toast = useToast()

const form = ref({ name: '', calories: '', protein: '', carbs: '', fat: '' })
const isSaving = ref(false)

watch(
  () => props.entry,
  (entry) => {
    if (entry) {
      form.value = {
        name: entry.name,
        calories: entry.calories,
        protein: entry.protein,
        carbs: entry.carbs,
        fat: entry.fat,
      }
    }
  },
  { immediate: true },
)

const isValid = () => form.value.name.trim().length > 0 && Number(form.value.calories) >= 0

async function save() {
  if (!isValid()) return
  isSaving.value = true
  try {
    await log.updateEntry(props.entry.id, {
      name: form.value.name.trim(),
      calories: Math.round(Number(form.value.calories)) || 0,
      protein: Math.round(Number(form.value.protein)) || 0,
      carbs: Math.round(Number(form.value.carbs)) || 0,
      fat: Math.round(Number(form.value.fat)) || 0,
    })
    toast.success('Entry updated.')
    open.value = false
  } catch {
    toast.error("Couldn't save changes, try again.")
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <Dialog v-model:open="open" title="Edit entry">
    <div class="mt-3 flex flex-col gap-3">
      <div>
        <Label for="edit-name">Food</Label>
        <Input id="edit-name" v-model="form.name" placeholder="Food name" />
      </div>
      <div>
        <Label for="edit-calories">Calories</Label>
        <Input id="edit-calories" v-model="form.calories" type="number" inputmode="numeric" placeholder="kcal" />
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <Label for="edit-protein" class="text-protein">Protein</Label>
          <Input id="edit-protein" v-model="form.protein" type="number" inputmode="numeric" placeholder="g" />
        </div>
        <div>
          <Label for="edit-carbs" class="text-carbs">Carbs</Label>
          <Input id="edit-carbs" v-model="form.carbs" type="number" inputmode="numeric" placeholder="g" />
        </div>
        <div>
          <Label for="edit-fat" class="text-fat">Fat</Label>
          <Input id="edit-fat" v-model="form.fat" type="number" inputmode="numeric" placeholder="g" />
        </div>
      </div>
    </div>

    <Button class="mt-4 w-full" :disabled="!isValid() || isSaving" @click="save">
      <Spinner v-if="isSaving" class="w-4 h-4" />
      <span>Save changes</span>
    </Button>
  </Dialog>
</template>
