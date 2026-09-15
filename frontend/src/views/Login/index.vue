<template>
  <div class="min-h-screen grid place-items-center px-6">
    <div class="glass-card w-full max-w-sm p-8">
      <h1 class="text-2xl font-bold text-center mb-1">{{ isRegister ? '注册' : '登录' }}</h1>
      <p class="text-[var(--muted)] text-sm text-center mb-8">{{ isRegister ? '创建账号后自动登录' : '使用用户名与密码继续' }}</p>

      <form class="space-y-4" @submit.prevent="submit">
        <input v-model="form.username" class="input" placeholder="用户名" autocomplete="username" />
        <input v-model="form.password" class="input" type="password" placeholder="密码（至少 6 位）" autocomplete="current-password" />
        <button class="btn btn-primary w-full" :disabled="loading">{{ loading ? '请稍候...' : isRegister ? '注册' : '登录' }}</button>
      </form>

      <p class="text-center text-sm text-[var(--muted)] mt-6">
        <button class="hover:text-[var(--text)] transition" @click="isRegister = !isRegister">
          {{ isRegister ? '已有账号？去登录' : '没有账号？去注册' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../../api/request'
import { useAppStore } from '../../stores/app'
import { dialog } from '../../utils/ui'

const route = useRoute()
const { setAuth } = useAppStore()

const isRegister = ref(false)
const loading = ref(false)
const form = ref({ username: '', password: '' })

const submit = async () => {
  if (!form.value.username || form.value.password.length < 6) {
    return dialog.toast('请填写用户名和至少 6 位密码', 'error')
  }
  loading.value = true
  try {
    const res = isRegister.value
      ? await api.auth.register(form.value)
      : await api.auth.login(form.value)
    setAuth(res.token, res.user)
    dialog.toast(isRegister.value ? '注册成功' : '登录成功')
    window.location.hash = route.query.redirect || '/'
  } catch {
    /* 拦截器已提示 */
  } finally {
    loading.value = false
  }
}
</script>
