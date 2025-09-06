<template>
    <div class="bg-purple-300 p-8 flex w-full h-full">
      <div class="main-container w-full">
	      <div ref="editor" class="w-full "></div>
		  </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const editor = ref(null)
let editorInstance = null

onMounted(async () => {
	// Load CKEditor from CDN if not already loaded
	if (!window.ClassicEditor) {
		const script = document.createElement('script')
		script.src = 'https://cdn.ckeditor.com/ckeditor5/40.0.0/classic/ckeditor.js'
		document.head.appendChild(script)
		await new Promise(resolve => script.onload = resolve)
	}

	// Initialize editor
	editorInstance = await window.ClassicEditor.create(editor.value)
})

onUnmounted(() => {
	if (editorInstance) {
		editorInstance.destroy()
	}
})
</script>
