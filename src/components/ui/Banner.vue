<template>
  <Message
    v-if="isVisible"
    :severity="severity"
    :closable="closable"
    :life="life"
    :icon="icon"
    @close="dismiss"
    @life-end="dismiss"
    class="w-full"
  >
    <div v-if="title || message" class="flex flex-col space-y-1">
      <p v-if="title" class="font-medium">{{ title }}</p>
      <p v-if="message" class="text-sm opacity-90">{{ message }}</p>
    </div>
    <slot v-else />
  </Message>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { BannerProps } from '@/types/banner'

defineOptions({
  name: 'UiBanner'
})

const props = withDefaults(defineProps<BannerProps>(), {
  closable: true,
  life: 0
})

const emit = defineEmits<{
  dismiss: []
}>()

const isVisible = ref(true)
let autoHideTimeout: ReturnType<typeof setTimeout> | null = null

const dismiss = () => {
  isVisible.value = false
  emit('dismiss')
  
  if (autoHideTimeout) {
    clearTimeout(autoHideTimeout)
    autoHideTimeout = null
  }
}

onMounted(() => {
  if (props.life && props.life > 0) {
    autoHideTimeout = setTimeout(() => {
      dismiss()
    }, props.life)
  }
})

onUnmounted(() => {
  if (autoHideTimeout) {
    clearTimeout(autoHideTimeout)
    autoHideTimeout = null
  }
})
</script>