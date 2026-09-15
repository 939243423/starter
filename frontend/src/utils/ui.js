import { reactive } from 'vue'

const state = reactive({
  dialog: {
    show: false,
    title: '',
    message: '',
    confirmText: '确定',
    cancelText: '取消',
    buttons: [],
    resolve: null,
    type: 'confirm', // confirm | alert | loading | select
  },
  toasts: [],
})

export const dialog = {
  confirm(title, message, options = {}) {
    Object.assign(state.dialog, {
      title,
      message,
      confirmText: options.confirmText || '确定',
      cancelText: options.cancelText || '取消',
      type: 'confirm',
      show: true,
    })
    return new Promise((resolve) => {
      state.dialog.resolve = resolve
    })
  },

  alert(title, message, options = {}) {
    Object.assign(state.dialog, {
      title,
      message,
      confirmText: options.confirmText || '知道了',
      type: 'alert',
      show: true,
    })
    return new Promise((resolve) => {
      state.dialog.resolve = resolve
    })
  },

  select(title, message, buttons = []) {
    Object.assign(state.dialog, { title, message, buttons, type: 'select', show: true })
  },

  loading(message) {
    Object.assign(state.dialog, { title: '请稍候', message, type: 'loading', show: true })
    return {
      close: () => {
        state.dialog.show = false
      },
    }
  },

  toast(message, type = 'success', duration = 3000) {
    const id = Date.now() + Math.random()
    state.toasts.push({ id, message, type })
    setTimeout(() => {
      state.toasts = state.toasts.filter((t) => t.id !== id)
    }, duration)
  },

  handleAction(result) {
    state.dialog.show = false
    if (state.dialog.resolve) {
      state.dialog.resolve(result)
      state.dialog.resolve = null
    }
  },
}

export const useUIState = () => state
