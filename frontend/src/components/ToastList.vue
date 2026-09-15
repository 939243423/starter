<template>
  <div class="fixed top-6 left-1/2 -translate-x-1/2 z-[1100] space-y-3 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in state.toasts"
        :key="toast.id"
        class="px-6 py-3 rounded-full shadow-2xl border backdrop-blur-md flex items-center gap-3 transition-all duration-300 pointer-events-auto"
        :class="toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'"
      >
        <div class="w-2 h-2 rounded-full" :class="toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'"></div>
        <span class="text-sm font-bold">{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useUIState } from '../utils/ui'

const state = useUIState()
</script>

<style scoped>
.toast-enter-from { opacity: 0; transform: translateY(-20px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: scale(0.9); }
</style>
