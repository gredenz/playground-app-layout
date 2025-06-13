<template>
	<div class="h-screen w-screen">
		<!-- 3 Column Layout -->
		<ThreePanelLayout v-if="toolStore.activeLayoutMode === '3col'" class="bg-gray-100">
			<template #main>
				<div class="bg-gray-300 flex-col h-full">
					<component
						:is="toolStore.activeMainComponent"
						v-if="toolStore.activeMainComponent"
					/>
					<div v-else class="p-4">Main component loading...</div>
				</div>
			</template>

			<template #middle>
				<div class="bg-blue-300 flex h-full">
					<component
						:is="toolStore.activeMiddleComponent"
						v-if="toolStore.activeMiddleComponent"
					/>
					<div v-else class="p-4">Middle component loading...</div>
				</div>
			</template>

			<template #right>
				<component
					:is="toolStore.activeRightComponent"
					v-if="toolStore.activeRightComponent && toolStore.currentLayoutConfig.right !== 'hidden'"
				/>
				<div v-else-if="toolStore.currentLayoutConfig.right === 'hidden'" class="hidden"></div>
				<div v-else class="p-4">Right component loading...</div>
			</template>
		</ThreePanelLayout>

		<!-- 2 Column Layout -->
		<TwoPanelLayout v-else-if="toolStore.activeLayoutMode === '2col'" class="bg-gray-100">
			<template #main>
				<div class="bg-gray-300 flex-col h-full">
					<component
						:is="toolStore.activeMainComponent"
						v-if="toolStore.activeMainComponent"
					/>
					<div v-else class="p-4">Main component loading...</div>
				</div>
			</template>

			<template #right>
				<component
					:is="toolStore.activeRightComponent"
					v-if="toolStore.activeRightComponent && toolStore.currentLayoutConfig.right !== 'hidden'"
				/>
				<div v-else-if="toolStore.currentLayoutConfig.right === 'hidden'" class="hidden"></div>
				<div v-else class="p-4">Right component loading...</div>
			</template>
		</TwoPanelLayout>

		<!-- Focused Layout (full width main) -->
		<FocusedLayout v-else-if="toolStore.activeLayoutMode === 'focused'" class="bg-gray-100">
			<template #main>
				<div class="bg-gray-300 flex-col h-full">
					<component
						:is="toolStore.activeMainComponent"
						v-if="toolStore.activeMainComponent"
					/>
					<div v-else class="p-4">Main component loading...</div>
				</div>
			</template>

			<template #overlay v-if="toolStore.currentLayoutConfig.right !== 'hidden'">
				<component
					:is="toolStore.activeRightComponent"
					v-if="toolStore.activeRightComponent"
				/>
			</template>
		</FocusedLayout>

		<!-- Fallback -->
		<div v-else class="p-4">
			Unknown layout mode: {{ toolStore.activeLayoutMode }}
		</div>

		<!-- Layout Mode Switcher (for debugging/testing) -->
		<div class="fixed top-4 left-4 bg-white p-2 rounded shadow-lg z-50">
			<div class="text-xs font-bold mb-2">Layout Mode:</div>
			<div class="flex gap-2">
				<button
					v-for="mode in toolStore.supportedLayoutModes"
					:key="mode"
					@click="toolStore.setActiveLayoutMode(mode)"
					class="px-2 py-1 text-xs rounded transition-colors"
					:class="
						toolStore.activeLayoutMode === mode
							? 'bg-blue-500 text-white'
							: 'bg-gray-200 hover:bg-gray-300'
					"
				>
					{{ mode }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useToolStore } from '@/stores/tool.store'
import ThreePanelLayout from '@/ThreePanelLayout.vue'
import TwoPanelLayout from '@/TwoPanelLayout.vue'
import FocusedLayout from '@/FocusedLayout.vue'

const toolStore = useToolStore()
</script>
