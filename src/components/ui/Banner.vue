<template>
  <div 
    v-if="isVisible"
    class="banner w-full px-4 py-3 flex items-center justify-between shadow-sm z-50"
    :class="bannerClasses"
    role="alert"
  >
    <div class="flex items-center space-x-3">
      <!-- Icon based on type -->
      <div class="flex-shrink-0">
        <component :is="iconComponent" class="w-5 h-5" />
      </div>
      
      <!-- Message content -->
      <div class="flex-1">
        <p class="text-sm font-medium">{{ title }}</p>
        <p v-if="message" class="text-sm opacity-90">{{ message }}</p>
      </div>
    </div>

    <!-- Dismiss button -->
    <button
      v-if="dismissible"
      @click="dismiss"
      class="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
      :aria-label="`Dismiss ${type} notification`"
    >
      <XMarkIcon class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, defineEmits } from 'vue'

// Icons - using simple SVG icons instead of external library
const InfoIcon = {
  template: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" /></svg>`
}

const WarningIcon = {
  template: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.19-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>`
}

const ErrorIcon = {
  template: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" /></svg>`
}

const SuccessIcon = {
  template: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.53 10.53a.75.75 0 00-1.06 1.061l2.03 2.03a.75.75 0 001.137-.089l3.857-5.401z" clip-rule="evenodd" /></svg>`
}

const MaintenanceIcon = {
  template: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.205 1.251l-1.18 2.044a1 1 0 01-1.186.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.205-1.251l1.18-2.044a1 1 0 011.186-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>`
}

const XMarkIcon = {
  template: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>`
}

export interface BannerProps {
  type: 'info' | 'warning' | 'error' | 'success' | 'maintenance'
  title: string
  message?: string
  dismissible?: boolean
  autoHide?: boolean
  autoHideDelay?: number
}

const props = withDefaults(defineProps<BannerProps>(), {
  dismissible: true,
  autoHide: false,
  autoHideDelay: 5000
})

const emit = defineEmits<{
  dismiss: []
}>()

const isVisible = ref(true)

const iconComponent = computed(() => {
  const icons = {
    info: InfoIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    success: SuccessIcon,
    maintenance: MaintenanceIcon
  }
  return icons[props.type]
})

const bannerClasses = computed(() => {
  const baseClasses = 'border-l-4'
  const typeClasses = {
    info: 'bg-blue-50 border-blue-400 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    success: 'bg-green-50 border-green-400 text-green-800',
    maintenance: 'bg-purple-50 border-purple-400 text-purple-800'
  }
  return `${baseClasses} ${typeClasses[props.type]}`
})

const dismiss = () => {
  isVisible.value = false
  emit('dismiss')
}

onMounted(() => {
  if (props.autoHide) {
    setTimeout(() => {
      dismiss()
    }, props.autoHideDelay)
  }
})
</script>

<style scoped>
.banner {
  transition: all 0.3s ease-in-out;
}
</style>