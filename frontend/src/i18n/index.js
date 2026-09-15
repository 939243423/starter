import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'
import { storage } from '../utils/storage'
import { STORAGE_KEYS } from '../config'

const i18n = createI18n({
  legacy: false,
  locale: storage.get(STORAGE_KEYS.lang, 'zh-CN'),
  fallbackLocale: 'en-US',
  messages: { 'zh-CN': zhCN, 'en-US': enUS },
})

/** 切换语言并持久化 */
export const setLocale = (locale) => {
  i18n.global.locale.value = locale
  storage.set(STORAGE_KEYS.lang, locale)
}

export default i18n
