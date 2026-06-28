<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, LogOut, Scale, Pencil } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { todayKey } from '@/utils/date'
import { ACTIVITY_LEVELS } from '@/utils/calorie'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Avatar from '@/components/ui/Avatar.vue'
import Spinner from '@/components/ui/Spinner.vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import Select from '@/components/ui/Select.vue'
import Dialog from '@/components/ui/Dialog.vue'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const isEditing = ref(false)
const showAdvanced = ref(false)

const form = reactive({
  name: '',
  age: '',
  heightCm: '',
  sex: 'male',
  goal: 'maintain',
  activityLevel: 'light',
})

function startEdit() {
  form.name = auth.user.name
  form.age = auth.user.age
  form.heightCm = auth.user.heightCm
  form.sex = auth.user.sex
  form.goal = auth.user.goal
  form.activityLevel = auth.user.activityLevel
  showAdvanced.value = false
  isEditing.value = true
}

const goalOptions = [
  { value: 'lose', label: 'Lose' },
  { value: 'maintain', label: 'Maintain' },
  { value: 'gain', label: 'Gain' },
]
const sexOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]
const activityOptions = Object.entries(ACTIVITY_LEVELS).map(([value, v]) => ({ value, label: v.label }))

const goalLabel = computed(() => ({ lose: 'Losing weight', maintain: 'Maintaining', gain: 'Gaining weight' }[auth.user.goal]))

const isFormValid = computed(() => {
  const age = Number(form.age)
  const h = Number(form.heightCm)
  return form.name.trim().length >= 2 && age >= 10 && age <= 100 && h >= 100 && h <= 250
})

async function saveProfile() {
  if (!isFormValid.value) return
  try {
    await auth.updateProfile({
      name: form.name.trim(),
      age: Number(form.age),
      heightCm: Number(form.heightCm),
      sex: form.sex,
      goal: form.goal,
      activityLevel: form.activityLevel,
    })
    toast.success('Profile updated.')
    isEditing.value = false
  } catch {
    toast.error("Couldn't save changes, try again.")
  }
}

// ----- weight update -----
const isWeightOpen = ref(false)
const weightInput = ref('')
const isSavingWeight = ref(false)

function openWeightDialog() {
  weightInput.value = String(auth.user.weightKg)
  isWeightOpen.value = true
}

async function logWeight() {
  const kg = Number(weightInput.value)
  if (!kg || kg < 30 || kg > 300) return
  isSavingWeight.value = true
  try {
    await auth.logWeight(kg, todayKey())
    toast.success('Weight logged.')
    isWeightOpen.value = false
  } catch {
    toast.error("Couldn't log your weight, try again.")
  } finally {
    isSavingWeight.value = false
  }
}

function logout() {
  auth.logout()
  router.replace({ name: 'login' })
}
</script>

<template>
  <div class="flex flex-col gap-4 lg:grid lg:grid-cols-[1fr_380px] lg:items-start lg:gap-6">
    <Card class="p-4 lg:p-6">
      <div class="flex items-center gap-3">
        <Avatar :name="auth.user.name" class="h-14 w-14 text-lg" />
        <div class="flex-1">
          <p class="font-semibold text-foreground">{{ auth.user.name }}</p>
          <p class="text-sm text-muted-foreground">{{ auth.user.email }}</p>
        </div>
        <button
          v-if="!isEditing"
          class="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent"
          @click="startEdit"
        >
          <Pencil class="h-3.5 w-3.5" /> Edit
        </button>
      </div>

      <!-- view mode -->
      <div v-if="!isEditing" class="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 text-center lg:max-w-sm">
        <div>
          <p class="text-base font-semibold tabular text-foreground">{{ auth.user.age }}</p>
          <p class="text-xs text-muted-foreground">years</p>
        </div>
        <div>
          <p class="text-base font-semibold tabular text-foreground">{{ auth.user.heightCm }}</p>
          <p class="text-xs text-muted-foreground">cm</p>
        </div>
        <div>
          <p class="text-base font-semibold tabular text-foreground">{{ auth.user.weightKg }}</p>
          <p class="text-xs text-muted-foreground">kg</p>
        </div>
      </div>
      <p v-if="!isEditing" class="mt-3 text-center text-sm text-muted-foreground lg:text-left">{{ goalLabel }}</p>

      <!-- edit mode -->
      <div v-else class="mt-4 flex flex-col gap-3 border-t border-border pt-4 lg:max-w-sm">
        <div>
          <Label for="profile-name">Name</Label>
          <Input id="profile-name" v-model="form.name" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <Label for="profile-age">Age</Label>
            <Input id="profile-age" v-model="form.age" type="number" inputmode="numeric" />
          </div>
          <div>
            <Label for="profile-height">Height (cm)</Label>
            <Input id="profile-height" v-model="form.heightCm" type="number" inputmode="numeric" />
          </div>
        </div>
        <div>
          <Label>Goal</Label>
          <SegmentedControl v-model="form.goal" :options="goalOptions" />
        </div>

        <button class="flex items-center gap-1 text-sm font-medium text-primary self-start" @click="showAdvanced = !showAdvanced">
          Advanced
          <ChevronDown class="h-3.5 w-3.5 transition-transform" :class="showAdvanced ? 'rotate-180' : ''" />
        </button>

        <div v-if="showAdvanced" class="flex flex-col gap-3">
          <div>
            <Label>Sex</Label>
            <SegmentedControl v-model="form.sex" :options="sexOptions" />
            <p class="mt-1 text-xs text-muted-foreground">Used only to estimate your calorie needs.</p>
          </div>
          <div>
            <Label>Activity level</Label>
            <Select v-model="form.activityLevel" :options="activityOptions" />
          </div>
        </div>

        <div class="flex gap-2 mt-1">
          <Button variant="outline" class="flex-1" :disabled="auth.isSavingProfile" @click="isEditing = false">Cancel</Button>
          <Button class="flex-1" :disabled="!isFormValid || auth.isSavingProfile" @click="saveProfile">
            <Spinner v-if="auth.isSavingProfile" class="w-4 h-4" />
            <span>Save</span>
          </Button>
        </div>
      </div>
    </Card>

    <div class="flex flex-col gap-4">
      <Card class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Scale class="h-4 w-4 text-muted-foreground" />
            <span class="text-sm font-medium text-foreground">Current weight</span>
          </div>
          <span class="text-sm font-semibold tabular text-foreground">{{ auth.user.weightKg }} kg</span>
        </div>
        <Button variant="secondary" class="mt-3 w-full" size="sm" @click="openWeightDialog">Log new weight</Button>
      </Card>

      <Card class="p-4">
        <CardHeader class="p-0 mb-2"><CardTitle class="text-sm">Your daily targets</CardTitle></CardHeader>
        <CardContent class="p-0 grid grid-cols-2 gap-3">
          <div class="rounded-xl bg-muted p-3">
            <p class="text-lg font-bold tabular text-primary">{{ auth.targets.calories }}</p>
            <p class="text-xs text-muted-foreground">kcal / day</p>
          </div>
          <div class="rounded-xl bg-muted p-3">
            <p class="text-lg font-bold tabular text-water">{{ auth.targets.waterMl }}</p>
            <p class="text-xs text-muted-foreground">ml water</p>
          </div>
          <div class="rounded-xl bg-muted p-3">
            <p class="text-sm font-semibold tabular text-foreground">
              <span class="text-protein">{{ auth.targets.protein }}p</span> ·
              <span class="text-carbs">{{ auth.targets.carbs }}c</span> ·
              <span class="text-fat">{{ auth.targets.fat }}f</span>
            </p>
            <p class="text-xs text-muted-foreground">grams / day</p>
          </div>
        </CardContent>
        <p class="mt-3 text-xs text-muted-foreground">Based on your age, height, weight, sex and goal.</p>
      </Card>

      <Button variant="outline" class="w-full text-destructive" @click="logout">
        <LogOut class="h-4 w-4" /> Log out
      </Button>
    </div>

    <Dialog v-model:open="isWeightOpen" title="Log new weight">
      <div class="mt-3">
        <Label for="weight-input">Weight (kg)</Label>
        <Input id="weight-input" v-model="weightInput" type="number" inputmode="numeric" />
      </div>
      <Button class="mt-4 w-full" :disabled="isSavingWeight" @click="logWeight">
        <Spinner v-if="isSavingWeight" class="w-4 h-4" />
        <span>Save</span>
      </Button>
    </Dialog>
  </div>
</template>
