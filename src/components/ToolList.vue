<template>
    <div class="bg-green-300 border-l-2 flex flex-col h-full border-green-900 p-2">
        <h3 class="font-bold mb-4">Tools</h3>
        <div class="space-y-2">
            <button v-for="tool in tools" :key="tool" @click="toolStore.setActiveTool(tool as Tool)"
                class="w-full px-3 py-2 rounded text-left transition-colors"
                :class="toolStore.activeTool === tool ? 'bg-green-500 text-white' : 'hover:bg-green-200'">
                {{ tool.charAt(0).toUpperCase() + tool.slice(1) }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useToolStore, type Tool } from '@/stores/tool.store'

const toolStore = useToolStore()

const tools = ['editor', 'specSheet']


</script>