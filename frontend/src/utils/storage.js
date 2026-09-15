/**
 * localStorage 安全封装（自动 JSON 序列化，解析失败返回兜底值）
 */
export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? fallback : JSON.parse(raw)
    } catch {
      return fallback
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* 隐私模式 / 配额不足时静默失败 */
    }
  },
  remove(key) {
    localStorage.removeItem(key)
  },
}
