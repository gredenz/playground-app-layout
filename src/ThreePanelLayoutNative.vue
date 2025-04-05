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
import { ref, computed, onMounted, onUnmounted } from 'vue'

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

// Manual drag implementation (more reliable than useDraggable for this case)
const isDragging = ref(false)
let startX = 0
let startWidth = 0

const onDragStart = (e: MouseEvent) => {
    isDragging.value = true
    startX = e.clientX
    startWidth = mainPanelWidth.value
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    // Prevent transitions during drag
    document.body.classList.add('resize-active')
}

const onDragMove = (e: MouseEvent) => {
    if (!isDragging.value) return

    const deltaX = e.clientX - startX
    const newWidth = startWidth + deltaX

    // Set bounds for the main panel
    const maxWidth = window.innerWidth - RIGHT_PANEL_WIDTH - DIVIDER_WIDTH - 200 // Ensure middle panel has at least 200px

    if (newWidth >= MIN_MAIN_PANEL_WIDTH && newWidth <= maxWidth) {
        mainPanelWidth.value = newWidth
    }
}

const onDragEnd = () => {
    isDragging.value = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''

    // Restore transitions
    document.body.classList.remove('resize-active')
}

// Handle window resize
const handleResize = () => {
    // Ensure panels stay within bounds when window resizes
    const maxWidth = window.innerWidth - RIGHT_PANEL_WIDTH - DIVIDER_WIDTH - 200
    if (mainPanelWidth.value > maxWidth) {
        mainPanelWidth.value = maxWidth
    }
}

onMounted(() => {
    if (dividerRef.value) {
        dividerRef.value.addEventListener('mousedown', onDragStart)
    }

    window.addEventListener('mousemove', onDragMove)
    window.addEventListener('mouseup', onDragEnd)
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    if (dividerRef.value) {
        dividerRef.value.removeEventListener('mousedown', onDragStart)
    }

    window.removeEventListener('mousemove', onDragMove)
    window.removeEventListener('mouseup', onDragEnd)
    window.removeEventListener('resize', handleResize)
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