import { useEffect, useRef, useState } from 'react'
import { activeGreeting } from '../data/greetings.js'

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
  return (
    <div className="greet" role="dialog" aria-modal="true" aria-label="Greeting" onClick={close}>
      <div className="greet__box" onClick={(e) => e.stopPropagation()}>
        <button className="greet__close" ref={closeBtn} onClick={close} aria-label="Close greeting">×</button>
        <img className="greet__img" src={greeting.image} alt={greeting.alt} />
      </div>
    </div>
  )
}
