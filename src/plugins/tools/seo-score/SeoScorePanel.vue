<template>
  <div class="seo-score-panel p-4 h-full flex flex-col">
    <h2 class="text-xl font-bold mb-4">SEO Score</h2>
    
    <div class="flex-1 flex flex-col items-center justify-center">
      <!-- Fake score display -->
      <div class="text-6xl font-bold mb-4" :class="scoreColor">
        {{ currentScore }}
      </div>
      
      <button 
        @click="runAnalysis"
        :disabled="isAnalyzing"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {{ isAnalyzing ? 'Analyzing...' : 'Run Analysis' }}
      </button>
    </div>
    
    <div class="mt-4 text-sm text-gray-600">
      Plugin-based component
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// This component is self-contained within the plugin
const currentScore = ref(75)
const isAnalyzing = ref(false)

const scoreColor = computed(() => {
  if (currentScore.value >= 80) return 'text-green-500'
  if (currentScore.value >= 60) return 'text-yellow-500'
  return 'text-red-500'
})

async function runAnalysis() {
  isAnalyzing.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  currentScore.value = Math.floor(Math.random() * 100)
  isAnalyzing.value = false
}
</script>