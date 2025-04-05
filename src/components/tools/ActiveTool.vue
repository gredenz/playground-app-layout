<script setup lang="ts">
import { useToolStore } from '@/stores/tool.store'

const toolStore = useToolStore()
</script>

<template>
    <component :is="toolStore.activeToolComponent" v-if="toolStore.activeToolComponent" />
    <div v-else class="p-4">Select a tool to get started (or component failed to load)</div>
</template>