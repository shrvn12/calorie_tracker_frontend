import { useToastStore } from '@/stores/toast'

export function useToast() {
  const store = useToastStore()
  return {
    success: (msg) => store.push('success', msg),
    error: (msg) => store.push('error', msg),
    info: (msg) => store.push('info', msg),
  }
}
