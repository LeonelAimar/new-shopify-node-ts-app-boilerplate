<template>
    <svg class="loading-spinner" 
        :width="width" :height="height" 
        viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" 
        fill="currentColor"
    >
        <path fill-rule="evenodd" clip-rule="evenodd" 
            d="M13.917 7A6.002 6.002 0 0 0 2.083 7H1.071a7.002 7.002 0 0 1 13.858 0h-1.012z"
        />
    </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        }
    }
})
</script>

<style lang="scss" scoped>
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% {  transform: rotate(359deg); }
}

.loading-spinner {
    animation: spin 1s linear infinite;
    fill: rgb(45, 95, 211);
    margin-top: 4rem;
}
</style>