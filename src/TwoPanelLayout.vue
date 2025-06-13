<template>
	<div class="h-screen w-screen flex">
		<!-- Main Panel -->
		<div class="flex-1 h-full" style="width: calc(100% - 320px)">
			<slot name="main"></slot>
		</div>

		<!-- Fixed Right Panel (320px) -->
		<div class="w-80 h-full" v-show="showRight">
			<slot name="right"></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
const showRight = true
</script>
