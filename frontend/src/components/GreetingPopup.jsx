import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import { activeGreeting } from '../data/greetings.js'

const PERSONAS = [
  {
    id: 'freshers',
    to: '/course-tracks/freshers',
    icon: 'sparkle',
    title: 'I am a Fresher',
    text: 'Student, recent graduate, or looking for my first tech offer.',
  },
  {
    id: 'experienced',
    to: '/course-tracks/experienced',
    icon: 'route',
    title: 'I am Experienced',
    text: 'Working professional looking to upskill or shift domains.',
    badge: 'Coming soon',
  },
]

const seenKey = (id) => `cwc_greeting_seen_${id}`
const wasSeen = (id) => { try { return sessionStorage.getItem(seenKey(id)) === '1' } catch { return false } }
const markSeen = (id) => { try { sessionStorage.setItem(seenKey(id), '1') } catch { /* private mode: it just shows again */ } }

// Greeting pop-up shown once per visit (browser tab session), on whatever page the visitor lands on.
export default function GreetingPopup() {
  const [greeting] = useState(() => {
    const g = activeGreeting()
    return g && !wasSeen(g.id) ? g : null
  })
  const [open, setOpen] = useState(false)
  const closeBtn = useRef(null)
  const navigate = useNavigate()

  const pickPersona = (p) => {
    try { localStorage.setItem('cwc_track', p.id) } catch { /* ignore */ }
    close()
    navigate(p.to)
  }

  // preload the image, then show: the pop-up never appears as an empty box
  useEffect(() => {
    if (!greeting) return undefined
    let cancelled = false
    if (greeting.kind === 'welcome') {
      const t = setTimeout(() => !cancelled && setOpen(true), 700)
      return () => { cancelled = true; clearTimeout(t) }
    }
    const img = new Image()
    const show = () => { if (!cancelled) setTimeout(() => !cancelled && setOpen(true), 500) }
    img.onload = show
    img.onerror = () => {} // image missing: stay silent
    img.src = greeting.image
    return () => { cancelled = true }
  }, [greeting])

  const close = () => { setOpen(false); if (greeting) markSeen(greeting.id) }

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeBtn.current?.focus()
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!greeting || !open) return null
  if (greeting.kind === 'welcome') {
    return (
      <div className="greet" role="dialog" aria-modal="true" aria-label="Welcome" onClick={close}>
        <div className="greet__box welc" onClick={(e) => e.stopPropagation()}>
          <button className="greet__close" ref={closeBtn} onClick={close} aria-label="Close welcome">×</button>
          <header className="welc__head">
            <p className="welc__eyebrow">Welcome to</p>
            <h2 className="welc__title">CWC Ecosystem</h2>
            <p className="welc__alias">Career with Chaitanya</p>
          </header>
          <p className="welc__sub">Tell us where you are in your career so we can show the right track.</p>
          <div className="persona-grid">
            {PERSONAS.map((p) => (
              <button key={p.id} type="button" onClick={() => pickPersona(p)} className="persona-card">
                <div className="persona-card__head">
                  <span className="welc__ic"><Icon name={p.icon} size={20} /></span>
                  {p.badge && <span className="persona-card__badge">{p.badge}</span>}
                </div>
                <strong>{p.title}</strong>
                <small>{p.text}</small>
                <span className="persona-card__go">Explore track <Icon name="arrow" size={14} /></span>
              </button>
            ))}
          </div>
          <footer className="welc__foot">
            <span className="welc__bar" aria-hidden="true"><i /></span>
            <button type="button" className="btn btn--outline welc__go" onClick={close}>Just browsing <Icon name="arrow" size={16} /></button>
          </footer>
        </div>
      </div>
    )
  }
  return (
    <div className="greet" role="dialog" aria-modal="true" aria-label="Greeting" onClick={close}>
      <div className="greet__box" onClick={(e) => e.stopPropagation()}>
        <button className="greet__close" ref={closeBtn} onClick={close} aria-label="Close greeting">×</button>
        <img className="greet__img" src={greeting.image} alt={greeting.alt} />
      </div>
    </div>
  )
}
