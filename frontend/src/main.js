import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { initTheme } from './stores/app'

const app = createApp(App)
app.use(router)
app.use(i18n)

initTheme() // 应用持久化的主题

// 路由就绪后再挂载，避免首屏闪动
router.isReady().then(() => app.mount('#app'))
