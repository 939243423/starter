import { createRouter, createWebHashHistory } from 'vue-router'
import { useAppStore } from '../stores/app'

const routes = [
  {
    path: '/',
    component: () => import('../components/AppShell.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('../views/Home/index.vue') },
      {
        path: 'playground',
        name: 'Playground',
        component: () => import('../views/Playground/index.vue'),
      },
      {
        path: 'secret',
        name: 'Secret',
        component: () => import('../views/Secret/index.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  { path: '/login', name: 'Login', component: () => import('../views/Login/index.vue') },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound/index.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  const { isLogin } = useAppStore()
  if (to.meta.requiresAuth && !isLogin.value) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'Login' && isLogin.value) {
    return { name: 'Home' }
  }
  return true
})

export default router
