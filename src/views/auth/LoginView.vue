<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { Eye, EyeOff, UtensilsCrossed } from '@lucide/vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const touched = ref(false)

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))
const canSubmit = computed(() => emailValid.value && password.value.length >= 6 && !auth.isLoggingIn)

async function onSubmit() {
  touched.value = true
  if (!canSubmit.value) return
  try {
    await auth.login({ email: email.value, password: password.value })
    router.replace(route.query.redirect || { name: 'dashboard' })
  } catch {
    // error message already surfaced via auth.error
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col justify-center px-6 py-10">
    <div class="mx-auto w-full max-w-sm">
      <div class="mb-8 flex flex-col items-center text-center">
        <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
          <UtensilsCrossed class="h-7 w-7 text-primary" />
        </div>
        <h1 class="text-2xl font-bold text-foreground">Welcome back</h1>
        <p class="mt-1 text-sm text-muted-foreground">Log in to keep your streak going.</p>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <div>
          <Label for="email">Email</Label>
          <Input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            :invalid="touched && !emailValid"
          />
          <p v-if="touched && !emailValid" class="mt-1 text-xs text-destructive">Enter a valid email address.</p>
        </div>

        <div>
          <Label for="password">Password</Label>
          <div class="relative">
            <Input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••"
              class="pr-11"
              :invalid="touched && password.length > 0 && password.length < 6"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <EyeOff v-if="showPassword" class="h-[18px] w-[18px]" />
              <Eye v-else class="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        <p v-if="auth.error" class="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">
          {{ auth.error }}
        </p>

        <Button type="submit" size="lg" :disabled="!canSubmit" class="mt-1">
          <Spinner v-if="auth.isLoggingIn" class="w-4 h-4" />
          <span>{{ auth.isLoggingIn ? 'Logging in…' : 'Log in' }}</span>
        </Button>
      </form>

      <p class="mt-6 text-center text-sm text-muted-foreground">
        New here?
        <RouterLink :to="{ name: 'signup' }" class="font-semibold text-primary">Create an account</RouterLink>
      </p>
    </div>
  </div>
</template>
