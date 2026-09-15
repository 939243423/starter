<template>
  <div class="min-h-screen flex flex-col">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-50 glass-card !rounded-none !border-x-0 !border-t-0">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <RouterLink to="/" class="flex items-center gap-2 font-bold text-lg">
            <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] grid place-items-center text-white text-sm">
              {{ initial }}
            </span>
            <span class="text-gradient">{{ appName }}</span>
          </RouterLink>

          <nav class="hidden md:flex items-center gap-1 text-sm">
            <RouterLink
              v-for="item in nav"
              :key="item.to"
              :to="item.to"
              class="px-3 py-2 rounded-lg transition-colors"
              :class="isActive(item.to) ? 'bg-[var(--surface)] text-[var(--text)]' : 'text-[var(--muted)] hover:text-[var(--text)]'"
            >
              {{ item.label }}
            </RouterLink>
          </nav>
        </div>

        <div class="flex items-center gap-2">
          <button class="p-2 rounded-lg hover:bg-[var(--surface)] transition" :title="t('common.language')" @click="toggleLang">
            <Languages :size="18" />
          </button>
          <button class="p-2 rounded-lg hover:bg-[var(--surface)] transition" :title="t('common.theme')" @click="toggleTheme">
            <Sun v-if="state.theme === 'dark'" :size="18" />
            <Moon v-else :size="18" />
          </button>

          <template v-if="isLogin">
            <span class="hidden sm:block text-sm text-[var(--muted)]">{{ state.user?.username }}</span>
            <button class="btn btn-ghost !px-3 !py-1.5 !text-xs" @click="onLogout">{{ t('common.logout') }}</button>
          </template>
          <RouterLink v-else to="/login" class="btn btn-primary !px-4 !py-1.5 !text-xs">
            {{ t('common.login') }}
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- 页脚 -->
    <footer class="py-8 text-center text-xs text-[var(--muted)]">
      <div class="divider mb-6 max-w-6xl mx-auto"></div>
      {{ appName }} · Powered by App Starter
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Languages, Sun, Moon } from 'lucide-vue-next'
import { useAppStore } from '../stores/app'
import { setLocale } from '../i18n'
import { APP_NAME } from '../config'

const route = useRoute()
const { t, locale } = useI18n()
const { state, isLogin, logout, applyTheme } = useAppStore()

const appName = APP_NAME
const initial = computed(() => appName.charAt(0).toUpperCase())

const nav = computed(() => [
  { to: '/', label: t('common.home') },
  { to: '/playground', label: t('common.playground') },
])

const isActive = (to) =>
  to === '/' ? route.path === '/' : route.path.startsWith(to)

const toggleLang = () => setLocale(locale.value === 'zh-CN' ? 'en-US' : 'zh-CN')

const toggleTheme = () => applyTheme(state.theme === 'dark' ? 'light' : 'dark')

const onLogout = () => {
  logout()
  window.location.hash = '/'
}
</script>
