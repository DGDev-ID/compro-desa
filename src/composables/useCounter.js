import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Animate a numeric counter from 0 to target value.
 * Usage: const { count, startCounter } = useCounter(1500, 2000)
 */
export function useCounter(target, duration = 2000) {
  const count = ref(0)
  let rafId = null
  let started = false

  function startCounter() {
    if (started) return
    started = true
    const startTime = performance.now()

    function update(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      count.value = Math.round(eased * target)
      if (progress < 1) {
        rafId = requestAnimationFrame(update)
      } else {
        count.value = target
      }
    }

    rafId = requestAnimationFrame(update)
  }

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId)
  })

  return { count, startCounter }
}

/**
 * Auto-start counter when element becomes visible via IntersectionObserver.
 */
export function useCounterOnVisible(target, duration = 2000) {
  const { count, startCounter } = useCounter(target, duration)
  const elRef = ref(null)

  onMounted(() => {
    if (!elRef.value) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCounter()
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(elRef.value)
    onUnmounted(() => observer.disconnect())
  })

  return { count, elRef }
}
