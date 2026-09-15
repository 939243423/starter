import axios from 'axios'
import { API_BASE, STORAGE_KEYS } from '../config'
import { storage } from '../utils/storage'
import { dialog } from '../utils/ui'

const request = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
})

request.interceptors.request.use(
  (config) => {
    const token = storage.get(STORAGE_KEYS.token, null)
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

request.interceptors.response.use(
  (response) => {
    const body = response.data
    // 后端统一信封 { code, message, data }：成功时拆出 data，失败时走错误分支
    if (body && typeof body === 'object' && 'code' in body) {
      if (body.code === 0) return body.data
      return Promise.reject(new Error(body.message || '请求失败'))
    }
    return body
  },
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || '网络请求错误'

    if (status === 401) {
      storage.remove(STORAGE_KEYS.token)
      storage.remove(STORAGE_KEYS.user)
      dialog.alert('登录过期', '您的登录状态已过期，请重新登录。').then(() => {
        window.location.hash = '/login'
      })
    } else {
      dialog.toast(message, 'error')
    }
    return Promise.reject(error)
  }
)

/** 业务 API 统一出口：新增接口时在这里挂方法，保持调用处简洁 */
export const api = {
  health: () => request.get('/health'),
  demo: {
    list: () => request.get('/demo/items'),
    create: (payload) => request.post('/demo/items', payload),
    remove: (id) => request.delete(`/demo/items/${id}`),
  },
  auth: {
    register: (payload) => request.post('/auth/register', payload),
    login: (payload) => request.post('/auth/login', payload),
    me: () => request.get('/auth/me'),
  },
}

export default request
