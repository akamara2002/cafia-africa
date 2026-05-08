// Debounce utility for scroll/resize events (16ms = one frame)
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number = 16
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}
