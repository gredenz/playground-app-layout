<template>
  <div v-if="hasError" class="p-4 m-2 bg-red-50 border border-red-200 rounded">
    <p class="text-red-700 font-medium">⚠️ Failed to load component</p>
    <p class="text-red-600 text-sm mt-1">{{ errorMessage }}</p>
    <button 
      @click="reset" 
      class="mt-2 text-sm text-red-600 underline hover:text-red-800"
    >
      Try again
    </button>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((err: Error) => {
  console.error('Component error:', err)
  hasError.value = true
  errorMessage.value = err.message || 'Unknown error occurred'
  return false // Prevent error from propagating
})

const reset = () => {
  hasError.value = false
  errorMessage.value = ''
}
</script>