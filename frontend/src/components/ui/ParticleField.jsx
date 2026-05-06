import { useEffect, useRef } from 'react'

export default function ParticleField({ count = 40 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particles = Array.from({ length: count }, (_, i) => {
      const el = document.createElement('div')
      const size = Math.random() * 3 + 1
      const x    = Math.random() * 100
      const delay = Math.random() * 8
      const dur   = 6 + Math.random() * 6
      const color = ['#00f5ff', '#bf00ff', '#ff006e', '#ffd700', '#00ff88'][Math.floor(Math.random() * 5)]

      el.style.cssText = `
        position:absolute; left:${x}%; bottom:-10px;
        width:${size}px; height:${size}px;
        background:${color};
        border-radius:50%;
        box-shadow: 0 0 ${size * 3}px ${color};
        animation: particle ${dur}s ${delay}s linear infinite;
        pointer-events:none;
      `
      container.appendChild(el)
      return el
    })

    return () => particles.forEach(p => p.remove())
  }, [count])

  return <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" />
}
