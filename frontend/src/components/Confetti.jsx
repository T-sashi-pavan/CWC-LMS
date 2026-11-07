import { useEffect, useRef, useState } from 'react'
import { useToast } from '../context/ToastContext.jsx'

const COLORS = ['#B9500F', '#D9722A', '#E8A03A', '#F4EDE1', '#1B1815']

// Bursts orange confetti (and a toast) the moment a new badge is earned.
export default function BadgeCelebration({ badges }) {
  const toast = useToast()
  const seen = useRef(new Set(badges.filter((b) => b.got).map((b) => b.id)))
  const [burst, setBurst] = useState(0)

  useEffect(() => {
    const fresh = badges.filter((b) => b.got && !seen.current.has(b.id))
    if (!fresh.length) return undefined
    fresh.forEach((b) => seen.current.add(b.id))
    toast(`You unlocked “${fresh[0].title}”.`, { title: 'New badge' })
    setBurst((n) => n + 1)
    const t = setTimeout(() => setBurst(0), 2400)
    return () => clearTimeout(t)
  }, [badges, toast])

  if (!burst) return null
  return (
    <div className="confetti" aria-hidden="true" key={burst}>
      {Array.from({ length: 44 }, (_, i) => {
        const a = (i / 44) * Math.PI * 2 + Math.random() * 0.4
        const d = 160 + Math.random() * 260
        return (
          <i key={i} style={{
            '--x': `${Math.cos(a) * d}px`, '--y': `${Math.sin(a) * d - 120}px`,
            '--r': `${Math.random() * 720 - 360}deg`, background: COLORS[i % COLORS.length],
            animationDelay: `${Math.random() * 80}ms`,
          }} />
        )
      })}
    </div>
  )
}
