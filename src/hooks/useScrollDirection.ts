// Module-level singleton — mis à jour passivement à chaque scroll, zéro re-render
let _dir: 'up' | 'down' = 'down'
let _lastY = typeof window !== 'undefined' ? window.scrollY : 0

if (typeof window !== 'undefined') {
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY
      if (Math.abs(y - _lastY) > 1) {
        _dir = y > _lastY ? 'down' : 'up'
        _lastY = y
      }
    },
    { passive: true }
  )
}

export function getScrollDir(): 'up' | 'down' {
  return _dir
}
