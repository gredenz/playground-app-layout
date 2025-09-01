import type { ToastMessage } from '@/types/toast'

// Global toast service instance - will be set up in main.ts
let toastServiceInstance: any = null

export function setToastService(service: any) {
  toastServiceInstance = service
}

export function getToastService() {
  if (!toastServiceInstance) {
    console.warn('Toast service not initialized. Make sure setToastService is called in main.ts')
    return null
  }
  return toastServiceInstance
}

export function addToast(message: ToastMessage) {
  const toast = getToastService()
  if (!toast) return

  toast.add({
    severity: message.severity,
    summary: message.summary,
    detail: message.detail,
    life: message.sticky ? 0 : (message.life ?? 3000),
    closable: message.closable ?? true
  })
}

export function clearAllToasts() {
  const toast = getToastService()
  if (!toast) return
  
  toast.removeAllGroups()
}

export function removeToast(group?: string) {
  const toast = getToastService()
  if (!toast) return
  
  if (group) {
    toast.removeGroup(group)
  } else {
    toast.removeAllGroups()
  }
}