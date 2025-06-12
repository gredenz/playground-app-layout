<template>
    <div class="h-screen w-screen flex">
        <!-- Splitter for Main and Middle panels, with calculated width -->
        <div class="flex-1 h-full" style="width: calc(100% - 320px);">
            <Splitter class="h-full">
                <!-- Main Panel -->
                <SplitterPanel :size="50" :minSize="20">
                    <slot name="main"></slot>
                </SplitterPanel>

                <!-- Middle Panel -->
                <SplitterPanel :size="50" :minSize="20" v-show="showMiddle">
                    <slot name="middle"></slot>
                </SplitterPanel>
            </Splitter>
        </div>

        <!-- Fixed Right Panel (320px) -->
        <div class="w-80 h-full" v-show="showToolbar">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

const showMiddle = true;
const showToolbar = true;
</script>