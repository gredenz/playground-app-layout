<template>
  <h2 class="text-2xl font-bold" test-id="counter-text">{{ count }}</h2>
  <div class="flex max-w-xl gap-4">
    <button @click="increment" class="mt-4  py-2 bg-blue-500 text-white rounded">Increment</button>
    <button @click="decrement" class="mt-4  py-2 bg-blue-500 text-white rounded">
      Decrement
    </button>
    <button @click="addTwo" class="mt-4  py-2 bg-blue-500 text-white rounded">
      Add Two
    </button>
  </div>
</template>

<script lang="ts" setup>


import { ref } from 'vue';
import { sum } from './utils';

const count = ref(0)
const doubleDecrement = () => {
  count.value -= 2;
}
const increment = () => {
  count.value++
}

const doubleDecrement = () => {
  count.value -= 2
}

const addTwo = () => {
  count.value = sum(count.value, 2)
}
</script>
