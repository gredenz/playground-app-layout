<template>
  <div class="p-4 h-full bg-green-200">
    <h2 class="text-lg font-bold text-green-800 mb-4">Debug Logs</h2>
    
    <div class="space-y-3">
      <div class="bg-white p-3 rounded shadow">
        <h3 class="font-semibold mb-2">Recent Activity</h3>
        <div class="space-y-1 text-sm max-h-40 overflow-y-auto">
          <div v-for="log in logs" :key="log.id" class="flex justify-between">
            <span class="text-gray-600">{{ log.timestamp }}</span>
            <span :class="getLogLevelClass(log.level)">{{ log.message }}</span>
          </div>
          <div v-if="logs.length === 0" class="text-gray-500 italic">No logs yet...</div>
        </div>
      </div>
      
      <div class="bg-white p-3 rounded shadow">
        <h3 class="font-semibold mb-2">Network Requests</h3>
        <div class="text-sm space-y-1">
          <div>Active requests: {{ activeRequests }}</div>
          <div>Total requests: {{ totalRequests }}</div>
          <div>Failed requests: {{ failedRequests }}</div>
        </div>
      </div>
      
      <div class="bg-white p-3 rounded shadow">
        <h3 class="font-semibold mb-2">Quick Actions</h3>
        <div class="space-y-2">
          <button 
            @click="addDemoLog"
            class="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Add Demo Log
          </button>
          <button 
            @click="clearLogs"
            class="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Clear Logs
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface LogEntry {
  id: number
  timestamp: string
  level: 'info' | 'warn' | 'error'
  message: string
}

const logs = ref<LogEntry[]>([])
const activeRequests = ref(0)
const totalRequests = ref(12)
const failedRequests = ref(1)

let logIdCounter = 0

const getLogLevelClass = (level: string) => {
  switch (level) {
    case 'error': return 'text-red-600 font-medium'
    case 'warn': return 'text-yellow-600 font-medium'
    case 'info': 
    default: return 'text-blue-600'
  }
}

const addDemoLog = () => {
  const messages = [
    'Component loaded successfully',
    'API request completed',
    'User interaction detected',
    'State updated',
    'Route changed'
  ]
  
  const levels: Array<'info' | 'warn' | 'error'> = ['info', 'info', 'info', 'warn', 'error']
  
  logs.value.unshift({
    id: logIdCounter++,
    timestamp: new Date().toLocaleTimeString(),
    level: levels[Math.floor(Math.random() * levels.length)],
    message: messages[Math.floor(Math.random() * messages.length)]
  })
  
  // Keep only last 20 logs
  if (logs.value.length > 20) {
    logs.value = logs.value.slice(0, 20)
  }
}

const clearLogs = () => {
  logs.value = []
}
</script>