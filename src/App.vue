<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useBanner } from '@/composables/useBanner'
import AppBar from '@/components/layout/AppBar.vue'
import Banner from '@/components/ui/Banner.vue'
import Toast from 'primevue/toast'

const { activeBanner, dismissBanner } = useBanner()
</script>

<template>
  <div class="app min-h-screen flex flex-col bg-gray-50">
    <!-- Application Bar - Always at top -->
    <AppBar />
    
    <!-- Banner Area - Below AppBar, above content -->
    <div v-if="activeBanner" class="banner-container">
      <Banner
        :severity="activeBanner.severity"
        :title="activeBanner.title"
        :message="activeBanner.message"
        :closable="activeBanner.closable"
        :life="activeBanner.life"
        :icon="activeBanner.icon"
        @dismiss="dismissBanner"
      />
    </div>
    
    <!-- Main Content Area -->
    <main class="flex-1 container mx-auto px-4 py-6">
      <RouterView />
    </main>
    
    <!-- Toast messages - Floating -->
    <Toast />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.banner-container {
  /* Banner sits below the app bar */
  width: 100%;
  z-index: 30;
}

main {
  /* Main content takes remaining space */
  flex: 1;
  overflow-y: auto;
}
</style>