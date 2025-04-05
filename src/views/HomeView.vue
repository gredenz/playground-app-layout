<template>
  <ThreePanelLayout class="bg-red-300">
    <template #main>
      <div class="bg-gray-300 flex-col h-full">
        <ActiveMainComponent />
      </div>
    </template>
    <template #middle>
      <div class="bg-blue-300 flex h-full">
        <ActiveTool />
      </div>
    </template>
    <template #right>
      <ToolList />
    </template>
  </ThreePanelLayout>
</template>

<script setup lang="ts">
import ThreePanelLayout from '@/ThreePanelLayout.vue'
import ToolList from '@/components/ToolList.vue'
import ActiveTool from '@/components/tools/ActiveTool.vue'
import ActiveMainComponent from '@/components/mainComponents/ActiveMainComponent.vue'


</script>