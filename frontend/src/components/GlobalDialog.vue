<template>
  <Transition name="fade">
    <div v-if="state.dialog.show" class="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="state.dialog.type !== 'loading' && handleAction(false)"></div>

      <div class="relative w-full max-w-sm overflow-hidden animate-modal-in glass-card !bg-[var(--surface-solid)]">
        <div class="p-8 text-center">
          <div v-if="state.dialog.type === 'loading'" class="mb-6 flex justify-center">
            <div class="w-12 h-12 border-4 rounded-full animate-spin" style="border-color: var(--border); border-top-color: var(--accent)"></div>
          </div>
          <h3 v-if="state.dialog.title" class="text-xl font-bold mb-3">{{ state.dialog.title }}</h3>
          <p class="text-[var(--muted)] text-sm leading-relaxed">{{ state.dialog.message }}</p>
        </div>

        <div v-if="state.dialog.type !== 'loading'" class="flex" style="border-top: 1px solid var(--border)">
          <button
            v-if="state.dialog.type === 'confirm'"
            class="flex-1 px-6 py-4 text-sm font-bold text-[var(--muted)] hover:bg-[var(--surface)] transition"
            @click="handleAction(false)"
          >
            {{ state.dialog.cancelText }}
          </button>
          <div v-if="state.dialog.type === 'confirm'" class="w-[1px]" style="background: var(--border)"></div>
          <button
            class="flex-1 px-6 py-4 text-sm font-bold transition hover:bg-[var(--surface)]"
            style="color: var(--accent)"
            @click="handleAction(true)"
          >
            {{ state.dialog.confirmText }}
          </button>
        </div>

        <div v-if="state.dialog.type === 'select'" class="flex flex-col" style="border-top: 1px solid var(--border)">
          <button
            v-for="(btn, idx) in state.dialog.buttons"
            :key="idx"
            class="px-6 py-4 text-sm font-bold transition"
            :class="btn.type === 'primary' ? 'hover:bg-[var(--surface)]' : 'text-[var(--muted)] hover:bg-[var(--surface)]'"
            :style="btn.type === 'primary' ? 'color: var(--accent)' : ''"
            @click="handleSelect(btn)"
          >
            {{ btn.text }}
          </button>
          <button class="px-6 py-4 text-sm font-bold text-[var(--muted)] hover:bg-[var(--surface)] transition" @click="state.dialog.show = false">
            {{ $t('common.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useUIState, dialog } from '../utils/ui'

const state = useUIState()
const handleAction = (res) => dialog.handleAction(res)
const handleSelect = (btn) => {
  btn.action?.()
  state.dialog.show = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes modal-in {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-modal-in {
  animation: modal-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>
