<template>
    <div class="bg-green-300 border-l-2 flex flex-col space-y-2 h-full border-green-900 p-2">
        <h3 class="font-bold mb-4">Tools</h3>
        <div v-for="tool in appStore.availableTools" :key="tool.id" class="space-y-2">
            <button 
                @click="appStore.switchTool(tool.id)"
                class="w-full px-3 py-2 rounded text-left transition-colors"
                :class="appStore.activeTool?.id === tool.id ? 'bg-green-500 text-white' : 'hover:bg-green-200'"
            >
                {{ tool.name }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'

const appStore = useAppStore()
</script>
