<template>
	<div class="h-screen w-screen relative">
		<!-- Full width main content -->
		<div class="h-full w-full">
			<slot name="main"></slot>
		</div>

		<!-- Optional overlay panel (could be floating toolbar, etc.) -->
		<div
			v-if="$slots.overlay"
			class="absolute top-4 right-4 bg-white shadow-lg rounded-lg border max-w-sm z-10"
		>
			<slot name="overlay"></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
// Focused layout gives full screen to main content
// Optional overlay slot for floating panels
</script>
