import { reactive, computed, watch } from 'vue'
import { storage } from '../utils/storage'
import { STORAGE_KEYS } from '../config'
import { api } from '../api/request'

const state = reactive({
  token: storage.get(STORAGE_KEYS.token, null),
  user: storage.get(STORAGE_KEYS.user, null),
  theme: storage.get(STORAGE_KEYS.theme, 'dark'),
})

function applyTheme(theme) {
  document.documentElement.classList.toggle('theme-light', theme === 'light')
  state.theme = theme
  storage.set(STORAGE_KEYS.theme, theme)
}

watch(
  () => state.theme,
  (t) => document.documentElement.classList.toggle('theme-light', t === 'light')
)

export const useAppStore = () => {
  const isLogin = computed(() => Boolean(state.token))

  const setAuth = (token, user) => {
    state.token = token
    state.user = user
    storage.set(STORAGE_KEYS.token, token)
    storage.set(STORAGE_KEYS.user, user)
  }

  const logout = () => {
    state.token = null
    state.user = null
    storage.remove(STORAGE_KEYS.token)
    storage.remove(STORAGE_KEYS.user)
  }

  const refreshMe = async () => {
    if (!state.token) return null
    try {
      const user = await api.auth.me()
      state.user = user
      storage.set(STORAGE_KEYS.user, user)
      return user
    } catch {
      logout()
      return null
    }
  }

  return { state, isLogin, setAuth, logout, refreshMe, applyTheme }
}

export const initTheme = () => applyTheme(state.theme)
