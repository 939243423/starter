<template>
  <div class="max-w-6xl mx-auto px-6 py-20">
    <!-- Hero -->
    <section class="text-center animate-fade-up">
      <span class="chip mb-6">
        <span class="w-1.5 h-1.5 rounded-full" style="background: var(--accent)"></span>
        Vue 3 · Vite · Express · SQLite
      </span>
      <h1 class="text-5xl md:text-6xl font-bold leading-tight mb-6">
        <span class="text-gradient-light">{{ t('home.title') }}</span>
      </h1>
      <p class="text-[var(--muted)] text-lg max-w-2xl mx-auto mb-10">{{ t('home.subtitle') }}</p>
      <div class="flex items-center justify-center gap-3">
        <RouterLink to="/playground" class="btn btn-primary">{{ t('home.cta') }}</RouterLink>
        <a class="btn btn-ghost" href="https://vitejs.dev" target="_blank" rel="noreferrer">Vite Docs</a>
      </div>
    </section>

    <!-- 特性 -->
    <section class="grid md:grid-cols-3 gap-6 mt-20">
      <div v-for="card in cards" :key="card.title" class="glass-card card-hover p-8">
        <div class="w-11 h-11 rounded-xl grid place-items-center mb-5" style="background: var(--accent-soft)">
          <component :is="card.icon" :size="20" style="color: var(--accent)" />
        </div>
        <h3 class="text-lg font-bold mb-2">{{ card.title }}</h3>
        <p class="text-[var(--muted)] text-sm leading-relaxed">{{ card.desc }}</p>
      </div>
    </section>

    <!-- 快速开始 -->
    <section class="glass-card p-8 mt-10">
      <h3 class="font-bold mb-4">Quick Start</h3>
      <pre class="text-sm text-[var(--muted)] overflow-x-auto"><code>npm run setup     # 安装前后端依赖
npm run dev       # 前端 :5173  后端 :3000
npm run build     # 产出 frontend/dist
npm run create -- my-game   # 基于本架子生成新项目</code></pre>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Layers, Wrench, Gamepad2 } from 'lucide-vue-next'

const { t } = useI18n()

const cards = computed(() => [
  { icon: Layers, title: t('home.featureStack'), desc: t('home.featureStackDesc') },
  { icon: Wrench, title: t('home.featureTooling'), desc: t('home.featureToolingDesc') },
  { icon: Gamepad2, title: t('home.featureGame'), desc: t('home.featureGameDesc') },
])
</script>
