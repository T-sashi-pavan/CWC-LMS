import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { activeGreeting } from '../data/greetings.js'

const FEATURES = [
  { to: '/open-mic', icon: 'mic', title: 'Free resources', text: 'Open Mic, roadmaps and course videos' },
  { to: '/jobs', icon: 'briefcase', title: 'Jobs', text: 'Fresh openings for freshers and experienced' },
  { to: '/crack-company', icon: 'sparkle', title: 'Crack the Company', text: 'Round by round prep for top companies' },
  { to: '/interview-simulator', icon: 'bot', title: 'Interview Simulator', text: 'Practise real interview rounds' },
  { to: '/roadmaps', icon: 'route', title: 'Roadmaps', text: 'A clear path for the role you want' },
  { to: '/testimonials', icon: 'star', title: 'Success stories', text: 'Students who got hired' },
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
          <p className="welc__sub">Everything you need for your first offer, in one place.</p>
          <ul className="welc__grid">
            {FEATURES.map((f, i) => (
              <li key={f.to} style={{ '--i': i }}>
                <Link to={f.to} onClick={close} className="welc__item">
                  <span className="welc__ic"><Icon name={f.icon} size={20} /></span>
                  <span><strong>{f.title}</strong><small>{f.text}</small></span>
                </Link>
              </li>
            ))}
          </ul>
          <footer className="welc__foot">
            <span className="welc__bar" aria-hidden="true"><i /></span>
            <button className="btn welc__go" onClick={close}>Start exploring <Icon name="arrow" size={16} /></button>
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
