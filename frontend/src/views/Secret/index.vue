<template>
  <div class="max-w-3xl mx-auto px-6 py-20 text-center">
    <h1 class="text-3xl font-bold mb-4">需要登录才能访问</h1>
    <p class="text-[var(--muted)] mb-8">
      该页面在路由守卫中声明了 <code class="chip">meta.requiresAuth</code>，未登录会被重定向到登录页。
    </p>
    <div class="glass-card p-6 text-left">
      <pre class="text-xs text-[var(--muted)] overflow-x-auto"><code>{{ JSON.stringify(user, null, 2) }}</code></pre>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../stores/app'

const { state } = useAppStore()
const user = computed(() => state.user)
</script>
