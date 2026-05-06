import { useEffect, useRef } from 'react'

export default function GlitchText({ text, className = '', tag: Tag = 'span' }) {
  return (
    <Tag className={`glitch relative inline-block ${className}`} data-text={text}>
      {text}
    </Tag>
  )
}

export function TypewriterText({ texts = [], className = '' }) {
  const ref   = useRef(null)
  const idx   = useRef(0)
  const charIdx = useRef(0)
  const deleting = useRef(false)

  useEffect(() => {
    if (!ref.current || !texts.length) return
    let timer

    const tick = () => {
      const current = texts[idx.current]
      if (!deleting.current) {
        ref.current.textContent = current.slice(0, charIdx.current + 1)
        charIdx.current++
        if (charIdx.current === current.length) {
          deleting.current = true
          timer = setTimeout(tick, 2000)
          return
        }
      } else {
        ref.current.textContent = current.slice(0, charIdx.current - 1)
        charIdx.current--
        if (charIdx.current === 0) {
          deleting.current = false
          idx.current = (idx.current + 1) % texts.length
        }
      }
      timer = setTimeout(tick, deleting.current ? 50 : 100)
    }

    timer = setTimeout(tick, 500)
    return () => clearTimeout(timer)
  }, [texts])

  return (
    <span className={`${className} relative`}>
      <span ref={ref} />
      <span className="animate-pulse text-neon-cyan">|</span>
    </span>
  )
}

export function NeonCounter({ value, label, color = 'cyan' }) {
  const colorMap = {
    cyan:   'text-neon-cyan shadow-neon-cyan',
    purple: 'text-neon-purple shadow-neon-purple',
    pink:   'text-neon-pink shadow-neon-pink',
    gold:   'text-neon-gold shadow-neon-gold',
  }
  return (
    <div className="text-center">
      <div className={`font-mono text-4xl font-bold ${colorMap[color]}`} style={{ textShadow: `0 0 20px currentColor` }}>
        {value}
      </div>
      <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">{label}</div>
    </div>
  )
}
