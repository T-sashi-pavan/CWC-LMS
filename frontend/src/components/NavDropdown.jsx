import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'

export const FREE_RESOURCES = [
  { to: '/open-mic', icon: 'mic', title: 'Open Mic', text: 'Online and offline meets to speak up and learn.' },
  { to: '/roadmaps', icon: 'route', title: 'Roadmaps', text: 'Step-by-step plans for fresher and experienced roles.' },
  { to: '/courses', icon: 'sparkle', title: 'Course videos', text: 'Free video playlists in Telugu and English.' },
]

// Paid course tracks: not launched yet, so both blocks say "Coming soon" and don't link anywhere.
export const COURSE_LEVELS = [
  { soon: true, icon: 'sparkle', title: 'Freshers', text: 'Job-ready courses for your first role.' },
  { soon: true, icon: 'route', title: 'Experienced', text: 'Upskill and switch to a higher-paying role.' },
]

// One nav item that opens a menu. The tab strip scrolls sideways on small screens (which would clip a normal
// dropdown), so the menu is positioned with `fixed` from the button's own position.
export default function NavDropdown({ label = 'Free resources', items = FREE_RESOURCES }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ left: 0, top: 0 })
  const btn = useRef(null)
  const wrap = useRef(null)
  const { pathname } = useLocation()
  const active = items.some((i) => i.to && pathname === i.to || pathname.startsWith(`${i.to}/`))

  const place = () => {
    const r = btn.current?.getBoundingClientRect()
    if (!r) return
    const width = Math.min(340, window.innerWidth - 24)
    setPos({ left: Math.max(12, Math.min(r.left, window.innerWidth - width - 12)), top: r.bottom + 6, width })
  }
  const toggle = () => { if (!open) place(); setOpen((o) => !o) }

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    if (!open) return undefined
    const away = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false) }
    const esc = (e) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus() } }
    const close = () => setOpen(false)
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', esc)
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [open])

  return (
    <div className="navdd" ref={wrap}>
      <button
        ref={btn}
        type="button"
        className={`tab navdd__btn ${active ? 'is-active' : ''} ${open ? 'is-open' : ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
      >
        {label}
        <Icon name="chevron" size={15} className="navdd__chev" />
      </button>
      {open && (
        <div className="navdd__menu" role="menu" style={{ left: pos.left, top: pos.top, width: pos.width }}>
          {items.map((i) => i.soon ? (
            <div key={i.title} role="menuitem" aria-disabled="true" className="navdd__item navdd__item--soon">
              <span className="navdd__icon"><Icon name={i.icon} size={20} /></span>
              <span className="navdd__txt"><strong>{i.title}</strong><small>{i.text}</small></span>
              <span className="navdd__soon">Coming soon</span>
            </div>
          ) : (
            <Link key={i.to} to={i.to} role="menuitem" className={`navdd__item ${pathname.startsWith(i.to) ? 'is-active' : ''}`}>
              <span className="navdd__icon"><Icon name={i.icon} size={20} /></span>
              <span className="navdd__txt"><strong>{i.title}</strong><small>{i.text}</small></span>
              <Icon name="arrow" size={15} className="navdd__go" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
