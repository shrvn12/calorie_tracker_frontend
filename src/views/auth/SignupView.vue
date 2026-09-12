<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Spinner from '@/components/ui/Spinner.vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import { Eye, EyeOff, ChevronLeft } from '@lucide/vue'

const router = useRouter()
const auth = useAuthStore()

const step = ref(1)
const totalSteps = 3
const showPassword = ref(false)
const touched = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  age: '',
  sex: 'male',
  heightCm: '',
  weightKg: '',
  goal: 'maintain',
})

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
const step1Valid = computed(() => form.name.trim().length >= 2 && emailValid.value && form.password.length >= 6)
const step2Valid = computed(() => {
  const age = Number(form.age)
  const h = Number(form.heightCm)
  const w = Number(form.weightKg)
  return age >= 10 && age <= 100 && h >= 100 && h <= 250 && w >= 30 && w <= 300
})

const sexOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]
const goalOptions = [
  { value: 'lose', label: 'Lose weight', hint: 'Eat a little less' },
  { value: 'maintain', label: 'Maintain', hint: 'Stay around here' },
  { value: 'gain', label: 'Gain weight', hint: 'Eat a little more' },
]

function next() {
  touched.value = true
  if (step.value === 1 && !step1Valid.value) return
  if (step.value === 2 && !step2Valid.value) return
  touched.value = false
  step.value = Math.min(totalSteps, step.value + 1)
}

function back() {
  touched.value = false
  if (step.value === 1) {
    router.push({ name: 'login' })
  } else {
    step.value -= 1
  }
}

async function createAccount() {
  try {
    await auth.signup({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      age: Number(form.age),
      sex: form.sex,
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      goal: form.goal,
      activityLevel: 'light',
    })
    router.replace({ name: 'dashboard' })
  } catch {
    // auth.error already set; if it's the duplicate-email case, send them back
    if (auth.error.toLowerCase().includes('email')) step.value = 1
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col px-6 py-8">
    <div class="mx-auto flex w-full max-w-sm flex-1 flex-col">
      <div class="mb-6 flex items-center gap-3">
        <button type="button" class="rounded-lg p-1.5 text-muted-foreground hover:bg-accent" @click="back">
          <ChevronLeft class="h-5 w-5" />
        </button>
        <div class="flex flex-1 gap-1.5">
          <div
            v-for="s in totalSteps"
            :key="s"
            class="h-1.5 flex-1 rounded-full transition-colors"
            :class="s <= step ? 'bg-primary' : 'bg-muted'"
          />
        </div>
      </div>

      <!-- Step 1: account basics -->
      <template v-if="step === 1">
        <h1 class="text-2xl font-bold text-foreground">Create your account</h1>
        <p class="mt-1 text-sm text-muted-foreground">Just the basics to get you in.</p>

        <div class="mt-6 flex flex-col gap-4">
          <div>
            <Label for="name">Name</Label>
            <Input id="name" v-model="form.name" placeholder="Your name" autocomplete="name" :invalid="touched && form.name.trim().length < 2" />
          </div>
          <div>
            <Label for="signup-email">Email</Label>
            <Input id="signup-email" v-model="form.email" type="email" placeholder="you@example.com" autocomplete="email" :invalid="touched && !emailValid" />
          </div>
          <div>
            <Label for="signup-password">Password</Label>
            <div class="relative">
              <Input
                id="signup-password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="At least 8 characters"
                autocomplete="new-password"
                class="pr-11"
                :invalid="touched && form.password.length > 0 && form.password.length < 6"
              />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" @click="showPassword = !showPassword">
                <EyeOff v-if="showPassword" class="h-[18px] w-[18px]" />
                <Eye v-else class="h-[18px] w-[18px]" />
              </button>
            </div>
            <p class="mt-1 text-xs text-muted-foreground">{{ form.password.length }}/8 characters minimum</p>
          </div>
        </div>
      </template>

      <!-- Step 2: body basics, needed to size daily calories -->
      <template v-else-if="step === 2">
        <h1 class="text-2xl font-bold text-foreground">About you</h1>
        <p class="mt-1 text-sm text-muted-foreground">This is how we work out your daily calories.</p>

        <div class="mt-6 flex flex-col gap-4">
          <div>
            <Label>Sex</Label>
            <SegmentedControl v-model="form.sex" :options="sexOptions" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <Label for="age">Age</Label>
              <Input id="age" v-model="form.age" type="number" inputmode="numeric" placeholder="years" :invalid="touched && !(Number(form.age) >= 10 && Number(form.age) <= 100)" />
            </div>
            <div>
              <Label for="height">Height</Label>
              <Input id="height" v-model="form.heightCm" type="number" inputmode="numeric" placeholder="cm" :invalid="touched && !(Number(form.heightCm) >= 100 && Number(form.heightCm) <= 250)" />
            </div>
          </div>
          <div>
            <Label for="weight">Current weight</Label>
            <Input id="weight" v-model="form.weightKg" type="number" inputmode="numeric" placeholder="kg" :invalid="touched && !(Number(form.weightKg) >= 30 && Number(form.weightKg) <= 300)" />
            <p class="mt-1 text-xs text-muted-foreground">You can update this any time from Profile.</p>
          </div>
        </div>
      </template>

      <!-- Step 3: goal -->
      <template v-else>
        <h1 class="text-2xl font-bold text-foreground">What's your goal?</h1>
        <p class="mt-1 text-sm text-muted-foreground">We'll set your daily calories around this.</p>

        <div class="mt-6 flex flex-col gap-2">
          <SegmentedControl v-model="form.goal" :options="goalOptions" :columns="1" />
        </div>

        <p v-if="auth.error" class="mt-4 rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">
          {{ auth.error }}
        </p>
      </template>

      <div class="mt-auto pt-8">
        <Button v-if="step < totalSteps" size="lg" class="w-full" :disabled="(step === 1 && !step1Valid) || (step === 2 && !step2Valid)" @click="next">
          Continue
        </Button>
        <Button v-else size="lg" class="w-full" :disabled="auth.isSigningUp" @click="createAccount">
          <Spinner v-if="auth.isSigningUp" class="w-4 h-4" />
          <span>{{ auth.isSigningUp ? 'Creating account…' : 'Create account' }}</span>
        </Button>
      </div>

      <p v-if="step === 1" class="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?
        <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary">Log in</RouterLink>
      </p>
    </div>
  </div>
</template>
