<template>
  <div class="max-w-5xl mx-auto px-6 py-16 space-y-8">
    <header>
      <h1 class="text-3xl font-bold mb-2">联调台</h1>
      <p class="text-[var(--muted)] text-sm">验证前后端联通、鉴权链路与游戏主循环。</p>
    </header>

    <!-- 健康检查 -->
    <section class="glass-card p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-bold">后端健康检查</h2>
        <button class="btn btn-ghost !py-1.5 !text-xs" :disabled="healthLoading" @click="checkHealth">
          {{ healthLoading ? '请求中...' : 'GET /api/health' }}
        </button>
      </div>
      <pre class="text-xs text-[var(--muted)] overflow-x-auto">{{ healthPreview }}</pre>
    </section>

    <!-- Demo CRUD -->
    <section class="glass-card p-6">
      <h2 class="font-bold mb-4">示例资源 CRUD（写入需登录）</h2>
      <div class="flex gap-3 mb-4">
        <input v-model="form.title" class="input" placeholder="输入一个标题" @keyup.enter="addItem" />
        <button class="btn btn-primary !px-6" :disabled="creating" @click="addItem">添加</button>
      </div>
      <ul class="space-y-2">
        <li v-for="item in items" :key="item.id" class="flex items-center justify-between px-4 py-3 rounded-xl border" style="border-color: var(--border)">
          <span class="text-sm">{{ item.title }}</span>
          <button class="text-xs text-[var(--muted)] hover:text-red-400 transition" @click="removeItem(item.id)">删除</button>
        </li>
        <li v-if="!items.length" class="text-sm text-[var(--muted)]">暂无数据</li>
      </ul>
    </section>

    <!-- 游戏主循环 -->
    <section class="glass-card p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-bold">useGameLoop 主循环</h2>
        <div class="flex items-center gap-2">
          <span class="chip">FPS {{ fps }}</span>
          <button class="btn btn-ghost !py-1.5 !text-xs" @click="running ? stop() : start()">
            {{ running ? '暂停' : '开始' }}
          </button>
        </div>
      </div>
      <canvas ref="canvasRef" class="w-full rounded-xl border" style="border-color: var(--border); height: 240px"></canvas>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../../api/request'
import { useRequest } from '../../composables/useRequest'
import { useGameLoop } from '../../composables/useGameLoop'
import { dialog } from '../../utils/ui'

const healthPreview = ref('点击右上角按钮发起请求')
const { loading: healthLoading, run: checkHealth } = useRequest(async () => {
  try {
    const data = await api.health()
    healthPreview.value = JSON.stringify(data, null, 2)
  } catch (err) {
    healthPreview.value = `请求失败：${err.message}`
  }
})

const items = ref([])
const form = ref({ title: '' })
const creating = ref(false)

const loadItems = async () => {
  try {
    items.value = await api.demo.list()
  } catch {
    items.value = []
  }
}

const addItem = async () => {
  const title = form.value.title.trim()
  if (!title) return dialog.toast('请先输入标题', 'error')
  creating.value = true
  try {
    await api.demo.create({ title })
    form.value.title = ''
    dialog.toast('已添加')
    await loadItems()
  } finally {
    creating.value = false
  }
}

const removeItem = async (id) => {
  try {
    await api.demo.remove(id)
    dialog.toast('已删除')
    await loadItems()
  } catch {
    /* 拦截器已提示 */
  }
}

// 弹球演示：dt 驱动的帧循环
const canvasRef = ref(null)
const W = 800
const H = 240
const ball = { x: 120, y: 80, vx: 260, vy: 200, r: 14 }

const { fps, running, start, stop } = useGameLoop((dt) => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  if (canvas.width !== W * dpr) {
    canvas.width = W * dpr
    canvas.height = H * dpr
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, W, H)

  ball.x += ball.vx * dt
  ball.y += ball.vy * dt
  if (ball.x - ball.r < 0 || ball.x + ball.r > W) {
    ball.vx *= -1
    ball.x = Math.min(Math.max(ball.x, ball.r), W - ball.r)
  }
  if (ball.y - ball.r < 0 || ball.y + ball.r > H) {
    ball.vy *= -1
    ball.y = Math.min(Math.max(ball.y, ball.r), H - ball.r)
  }

  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#8b5cf6'
  ctx.fill()
})

onMounted(loadItems)
</script>
