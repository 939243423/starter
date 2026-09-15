import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 游戏主循环：基于 requestAnimationFrame，自动在组件卸载时停止
 *
 * const { fps, frame, running, start, stop } = useGameLoop((dt, ctx) => { ... })
 * dt: 距离上一帧的秒数；ctx: { frame, elapsed }
 */
export function useGameLoop(callback, { autoStart = true } = {}) {
  const running = ref(false)
  const fps = ref(0)
  const frame = ref(0)
  const elapsed = ref(0)

  let rafId = null
  let last = 0
  let acc = 0
  let frames = 0

  const tick = (now) => {
    if (!last) last = now
    const dt = Math.min((now - last) / 1000, 0.1) // 切后台回来时钳制，避免数值爆炸
    last = now
    elapsed.value += dt
    frame.value += 1

    acc += dt
    frames += 1
    if (acc >= 0.5) {
      fps.value = Math.round(frames / acc)
      acc = 0
      frames = 0
    }

    callback?.(dt, { frame: frame.value, elapsed: elapsed.value })
    rafId = requestAnimationFrame(tick)
  }

  const start = () => {
    if (running.value) return
    running.value = true
    last = 0
    rafId = requestAnimationFrame(tick)
  }

  const stop = () => {
    running.value = false
    if (rafId) cancelAnimationFrame(rafId)
    rafId = null
  }

  const reset = () => {
    stop()
    frame.value = 0
    elapsed.value = 0
    fps.value = 0
  }

  onMounted(() => autoStart && start())
  onUnmounted(stop)

  return { running, fps, frame, elapsed, start, stop, reset }
}
