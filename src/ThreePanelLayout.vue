<template>
    <div class="flex h-screen">
        <!-- Main Display Panel -->
        <div class="min-w-0" :style="{ width: `${mainPanelWidth}px` }">
            <slot name="main"></slot>
        </div>
        <!-- Divider -->
        <div class="w-1 bg-gray-300 cursor-col-resize hover:bg-blue-400 active:bg-blue-600" ref="dividerRef"></div>
        <!-- Middle Panel -->
        <div class="min-w-0" :style="{ width: `${middlePanelWidth}px` }">
            <slot name="middle"></slot>
        </div>
        <!-- Fixed Right Panel -->
        <div class="w-80">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useDraggable, useEventListener } from '@vueuse/core'

// Panel configuration
const MIN_MAIN_PANEL_WIDTH = 200
const RIGHT_PANEL_WIDTH = 320 // 80 * 4 = 320px in Tailwind's w-80
const DIVIDER_WIDTH = 4

// Panel state
const mainPanelWidth = ref(400) // Initial width
const middlePanelWidth = computed(() => {
    // Calculate available space and ensure the middle panel has a minimum width
    const availableWidth = window.innerWidth - mainPanelWidth.value - RIGHT_PANEL_WIDTH - DIVIDER_WIDTH
    return Math.max(200, availableWidth)
})

// References
const dividerRef = ref<HTMLDivElement | null>(null)

// Use VueUse's useDraggable
const { x, y, isDragging } = useDraggable(dividerRef, {
    initialValue: { x: mainPanelWidth.value, y: 0 },
    preventDefault: true,
    onStart: () => {
        // Disable transitions during drag
        document.body.classList.add('resize-active')
    },
    onEnd: () => {
        // Re-enable transitions
        document.body.classList.remove('resize-active')
    }
})

// Watch the x position from useDraggable and update panel width
watch(x, (newX) => {
    // Set bounds for the main panel
    const maxWidth = window.innerWidth - RIGHT_PANEL_WIDTH - DIVIDER_WIDTH - 200 // Ensure middle panel has at least 200px

    if (newX >= MIN_MAIN_PANEL_WIDTH && newX <= maxWidth) {
        mainPanelWidth.value = newX
    }
})

// Handle window resize
const handleResize = () => {
    // Ensure panels stay within bounds when window resizes
    const maxWidth = window.innerWidth - RIGHT_PANEL_WIDTH - DIVIDER_WIDTH - 200
    if (mainPanelWidth.value > maxWidth) {
        mainPanelWidth.value = maxWidth
    }

    // Update the divider position to match
    x.value = mainPanelWidth.value
}

// Use VueUse's useEventListener for window resize
useEventListener(window, 'resize', handleResize)

// Set initial position for the draggable divider
onMounted(() => {
    x.value = mainPanelWidth.value
})
</script>

<style>
/* Global styles to be added to your app.css or similar */
body.resize-active * {
    transition: none !important;
}

/* Scoped styles */
.cursor-col-resize {
    cursor: col-resize;
}
</style>