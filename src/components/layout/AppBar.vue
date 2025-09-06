<template>
  <header class="app-bar bg-gray-900 text-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Left section: Logo/Brand -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <span class="text-xl font-bold">My Vue App</span>
          </div>

          <!-- Navigation links -->
          <nav class="hidden md:flex items-center space-x-6 ml-8">
            <RouterLink
              to="/"
              class="hover:text-blue-400 transition-colors"
              active-class="text-blue-400"
            >
              Home
            </RouterLink>
            <RouterLink
              to="/about"
              class="hover:text-blue-400 transition-colors"
              active-class="text-blue-400"
            >
              About
            </RouterLink>
          </nav>

          <!-- Teleport target for tool-specific left navigation -->
          <div :id="TELEPORT_TARGETS.APP_BAR_LEFT" class="flex items-center space-x-4"></div>
        </div>

        <!-- Right section: User/Settings -->
        <div class="flex items-center space-x-4">
          <!-- Teleport target for tool-specific actions (before tool selector) -->
          <div :id="TELEPORT_TARGETS.APP_BAR_ACTIONS" class="flex items-center space-x-4"></div>

          <!-- Tool selector (if we have tools) -->
          <div v-if="availableTools.length > 0" class="flex items-center space-x-2">
            <label class="text-sm text-gray-300">Tool:</label>
            <select
              :value="activeTool?.id"
              @change="onToolChange"
              class="bg-gray-800 text-white px-3 py-1 rounded border border-gray-700 focus:border-blue-400 focus:outline-none"
            >
              <option value="">Select Tool</option>
              <option
                v-for="tool in availableTools"
                :key="tool.id"
                :value="tool.id"
              >
                {{ tool.name }}
              </option>
            </select>
          </div>

          <!-- Teleport target for tool-specific settings -->
          <div :id="TELEPORT_TARGETS.APP_BAR_SETTINGS" class="flex items-center space-x-4"></div>

                  <!-- Layout Mode Selector -->
        <div class="flex items-center space-x-4">
          <label class="text-xs font-semibold text-gray-600">Layout:</label>
          <div class="flex gap-1 mt-1" data-testid="layout-toggle">
            <button
              v-for="mode in layoutModes"
              :key="mode"
              @click="appStore.switchLayoutMode(mode)"
              class="px-2 py-1 text-xs rounded transition-colors"
              :class="appStore.currentLayoutMode === mode
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'"
              :disabled="!isLayoutSupported(mode)"
            >
              {{ mode }}
            </button>
          </div>
        </div>

          <!-- User menu placeholder -->
          <div class="flex items-center">
            <button class="p-2 rounded-full hover:bg-gray-800 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAppStore } from '@/stores/app.store'
import { computed } from 'vue'
import { TELEPORT_TARGETS } from '@/constants/teleportTargets'

const appStore = useAppStore()

const availableTools = computed(() => appStore.availableTools)
const activeTool = computed(() => appStore.activeTool)

const layoutModes = ['3col', '2col', 'focused'] as const

const isLayoutSupported = (mode: string) => {
  const tool = appStore.activeTool
  if (!tool) return false
  return !!tool.layouts[mode as keyof typeof tool.layouts]
}

const onToolChange = async (event: Event) => {
  const target = event.target as HTMLSelectElement
  const toolId = target.value

  if (toolId) {
    try {
      await appStore.switchTool(toolId)
    } catch (error) {
      console.error('Failed to switch tool:', error)
      // Reset selector to previous value
      if (activeTool.value) {
        target.value = activeTool.value.id
      } else {
        target.value = ''
      }
    }
  }
}
</script>

