import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)
  const pos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const animRef = useRef<number>(0)

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0
    if (isTouch) return
    setVisible(true)

    const move = (e: MouseEvent) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      }
    }

    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`
      }
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)

    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, [data-hover]')) setHovering(true)
    }
    const onMouseOut = (e: MouseEvent) => {
      const rel = e.relatedTarget as Element | null
      if (!rel?.closest('a, button, [data-hover]')) setHovering(false)
    }

    document.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseover', onMouseOver, { passive: true })
    document.addEventListener('mouseout', onMouseOut, { passive: true })

    return () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  if (!visible) return null

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={ringRef} className={`cursor-ring ${hovering ? 'hovering' : ''}`} />
    </>
  )
}
