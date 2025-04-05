<template>
    <div class="bg-green-300 border-l-2 flex flex-col space-y-2 h-full border-green-900 p-2">
        <h3 class="font-bold mb-4">Tools</h3>
        <div>
            <button @click="toolStore.setActiveTool('SeoScore')"
                class="w-full px-3 py-2 rounded text-left transition-colors"
                :class="toolStore.activeTool === 'SeoScore' ? 'bg-green-500 text-white' : 'hover:bg-green-200'">
                Seo Scoring
            </button>
        </div>

        <div class="space-y-2">
            <button @click="toolStore.setActiveTool('SpecSheetHosting')"
                class="w-full px-3 py-2 rounded text-left transition-colors"
                :class="toolStore.activeTool === 'SpecSheetHosting' ? 'bg-green-500 text-white' : 'hover:bg-green-200'">
                Spec Sheet
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useToolStore, type Tool } from '@/stores/tool.store'

const toolStore = useToolStore()

const tools = ['SeoScore', 'SpecSheetHosting']


</script>