import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Icon from './Icon.jsx'

// Avatar button at the top right; the full name and email live in the dropdown so nothing gets cropped.
export default function ProfileMenu() {
  const { user, displayName, isPro, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const box = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => box.current && !box.current.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const initial = (displayName || '?').trim()[0].toUpperCase()

  return (
    <div className="profile" ref={box}>
      <button
        className="profile__btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
      >
        <span className="avatar">{initial}</span>
        <Icon name="chevron" size={16} className={`profile__chev ${open ? 'is-open' : ''}`} />
      </button>

      {open && (
        <div className="profile__menu" role="menu">
          <div className="profile__head">
            <span className="avatar avatar--lg">{initial}</span>
            <div className="profile__who">
              <strong>{displayName}</strong>
              <span className="muted">{user?.email}</span>
            </div>
          </div>
          <div className="profile__plan">
            <span>Current plan</span>
            <span className={`badge ${isPro ? 'badge--pro' : ''}`}>{isPro ? 'PRO' : 'FREE'}</span>
          </div>
          <button
            role="menuitem"
            className="profile__item"
            onClick={async () => {
              setOpen(false)
              await signOut()
              navigate('/')
            }}
          >
            <Icon name="logout" size={17} /> Log out
          </button>
        </div>
      )}
    </div>
  )
}
