import { ref } from 'vue'
import { defineStore } from 'pinia'

let counter = 0

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])

  function push(type, message, duration = 3200) {
    const id = ++counter
    toasts.value.push({ id, type, message })
    setTimeout(() => dismiss(id), duration)
    return id
  }

  function dismiss(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, push, dismiss }
})
