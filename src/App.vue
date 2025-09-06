<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useBanner } from '@/composables/useBanner'
import AppBar from '@/components/layout/AppBar.vue'
import Banner from '@/components/ui/Banner.vue'
import Toast from 'primevue/toast'

const { activeBanner, dismissBanner } = useBanner()
</script>

<template>
  <div class="min-h-screen min-w-screen border-red-500 border-2 overflow-hidden flex flex-col">
    <!-- Application Bar - Always at top -->
    <AppBar class="border-2 border-green-700"/>

    <!-- Banner Area - Below AppBar, above content -->
    <div v-if="activeBanner" >
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
    <main class="flex border-4 border-blue-500 h-[calc(100vh-80px)] w-full">
      <RouterView />
    </main>

    <!-- Toast messages - Floating -->
    <Toast />
  </div>
</template>
