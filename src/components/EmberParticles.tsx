import { useEffect, useRef } from 'react'

interface Ember {
  x: number; y: number
  vx: number; vy: number
  size: number; opacity: number
  color: string; life: number; maxLife: number
}

const COLORS = ['#c9a54e', '#e8c87a', '#7c3aed', '#a78bfa', '#f43f5e', '#c9a54e', '#c9a54e']
const MAX_EMBERS = 25

export default function EmberParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const embers = useRef<Ember[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    ctx.imageSmoothingEnabled = false

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const spawnEmber = () => {
      if (embers.current.length >= MAX_EMBERS) return
      embers.current.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(0.3 + Math.random() * 0.7),
        size: 1 + Math.random() * 2.5,
        opacity: 0.6 + Math.random() * 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 0,
        maxLife: 120 + Math.random() * 180,
      })
    }

    let frame = 0
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (frame % 6 === 0) spawnEmber()
      frame++

      const live = embers.current
      const nextEmbers: Ember[] = []

      for (let i = 0; i < live.length; i++) {
        const e = live[i]
        e.life++
        if (e.life >= e.maxLife) continue
        nextEmbers.push(e)

        e.x += e.vx + Math.sin(e.life * 0.05) * 0.3
        e.y += e.vy

        const t = e.life / e.maxLife
        const alpha = e.opacity * (1 - t) * Math.min(1, t * 6)

        // Glow = deux cercles concentriques (plus léger que shadowBlur)
        ctx.globalAlpha = alpha * 0.25
        ctx.fillStyle = e.color
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.size * 2.5 * (1 - t * 0.3), 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = alpha
        ctx.fillStyle = e.color
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.size * (1 - t * 0.5), 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      embers.current = nextEmbers
      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current)
      } else {
        animRef.current = requestAnimationFrame(loop)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  )
}
