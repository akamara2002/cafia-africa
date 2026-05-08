// Shared IntersectionObserver for scroll-triggered animations
// Charts animate every time they enter viewport

type ChartAnimation = {
  animate: () => void
}

const chartRegistry = new Map<string, ChartAnimation>()

let observer: IntersectionObserver | null = null

if (typeof window !== 'undefined') {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-chart-id')
          if (!id) return

          const chart = chartRegistry.get(id)
          if (chart) {
            // Use double RAF for smoother animation start
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                chart.animate()
              })
            })
          }
        }
      })
    },
    { threshold: 0.05, rootMargin: '50px' }
  )
}

export function createScrollObserver(containerRef: React.RefObject<HTMLElement>, animateFn: () => void) {
  if (typeof window === 'undefined' || !observer || !containerRef.current) return () => {}

  const id = `chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  containerRef.current.setAttribute('data-chart-id', id)

  chartRegistry.set(id, { animate: animateFn })
  observer.observe(containerRef.current)

  return () => {
    if (containerRef.current) {
      const currentId = containerRef.current.getAttribute('data-chart-id')
      if (currentId) {
        chartRegistry.delete(currentId)
        observer?.unobserve(containerRef.current)
        containerRef.current.removeAttribute('data-chart-id')
      }
    }
  }
}

// Legacy support
export function registerChart(element: HTMLElement, animateFn: () => void) {
  if (typeof window === 'undefined' || !observer) return

  const id = element.getAttribute('data-chart-id')
  if (!id) {
    console.warn('Chart element missing data-chart-id attribute')
    return
  }

  chartRegistry.set(id, { animate: animateFn })
  observer.observe(element)
}

export function unregisterChart(element: HTMLElement) {
  if (typeof window === 'undefined' || !observer) return

  const id = element.getAttribute('data-chart-id')
  if (!id) return

  chartRegistry.delete(id)
  observer.unobserve(element)
}
