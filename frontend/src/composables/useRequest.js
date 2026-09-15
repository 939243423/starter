import { ref } from 'vue'

/**
 * 异步请求状态封装：自动维护 loading / error / data
 *
 * const { data, loading, error, run } = useRequest(api.demo.list)
 * await run()
 */
export function useRequest(fn, { immediate = false, defaultData = null, onError } = {}) {
  const data = ref(defaultData)
  const loading = ref(false)
  const error = ref(null)

  const run = async (...args) => {
    loading.value = true
    error.value = null
    try {
      data.value = await fn(...args)
      return data.value
    } catch (err) {
      error.value = err
      onError?.(err)
      return null
    } finally {
      loading.value = false
    }
  }

  if (immediate) run()

  return { data, loading, error, run }
}
