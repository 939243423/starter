/**
 * 全局常量：改项目名 / storage 前缀只需改这里
 */
export const APP_NAME = 'App Starter'
export const STORAGE_PREFIX = 'appstarter'

export const STORAGE_KEYS = {
  token: `${STORAGE_PREFIX}_token`,
  user: `${STORAGE_PREFIX}_user`,
  lang: `${STORAGE_PREFIX}_lang`,
  theme: `${STORAGE_PREFIX}_theme`,
}

export const API_BASE = import.meta.env.VITE_API_BASE || '/api'
