import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(api.getSession())
  const weightHistory = ref([])
  const isSigningUp = ref(false)
  const isLoggingIn = ref(false)
  const isSavingProfile = ref(false)
  const error = ref('')

  const isAuthenticated = computed(() => !!user.value)
  const targets = computed(() => user.value?.targets ?? null)

  function clearError() {
    error.value = ''
  }

  async function signup(payload) {
    error.value = ''
    isSigningUp.value = true
    try {
      const res = await api.signup(payload)
      user.value = res.user
      return res.user
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      isSigningUp.value = false
    }
  }

  async function login(payload) {
    error.value = ''
    isLoggingIn.value = true
    try {
      const res = await api.login(payload)
      user.value = res.user
      return res.user
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      isLoggingIn.value = false
    }
  }

  function logout() {
    api.logout()
    user.value = null
    weightHistory.value = []
  }

  async function updateProfile(patch) {
    isSavingProfile.value = true
    try {
      const res = await api.updateProfile(user.value.id, patch)
      user.value = res.user
      return res.user
    } finally {
      isSavingProfile.value = false
    }
  }

  async function logWeight(weightKg, dateKey) {
    isSavingProfile.value = true
    try {
      const res = await api.logWeight(user.value.id, weightKg, dateKey)
      if (res.user) user.value = res.user
      if (res.weightHistory) weightHistory.value = res.weightHistory
      return res
    } finally {
      isSavingProfile.value = false
    }
  }

  async function fetchWeightHistory() {
    try {
      const history = await api.getWeightHistory()
      weightHistory.value = history
    } catch (e) {
      console.error(e)
    }
  }

  return {
    user,
    weightHistory,
    isAuthenticated,
    targets,
    isSigningUp,
    isLoggingIn,
    isSavingProfile,
    error,
    clearError,
    signup,
    login,
    logout,
    updateProfile,
    logWeight,
    fetchWeightHistory,
  }
})
