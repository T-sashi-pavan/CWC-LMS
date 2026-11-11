import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

// Deters casual copy-paste of the roadmap text. HONEST LIMITS: nothing in a browser can stop screenshots or
// someone reading the page with developer tools. The real protection is server-side (the API only sends the
// full text to logged-in members). This layer makes copying inconvenient and traces leaks:
//   - text can't be selected, dragged, cut/copied or right-clicked, and the printout is blank
//   - a faint diagonal watermark carries the member's email, so a leaked screenshot points back to the account
export default function Protected({ children, className = '' }) {
  const { user } = useAuth()
  const tag = user?.email || 'Career with Chaitanya'

  const watermark = useMemo(() => {
    const t = `${tag}  ·  Career with Chaitanya`.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' width='360' height='220'>` +
      `<text x='20' y='120' transform='rotate(-22 180 110)' font-family='Poppins,Arial,sans-serif' ` +
      `font-size='15' fill='%23888' fill-opacity='.14'>${t}</text></svg>`
    return `url("data:image/svg+xml;utf8,${svg.replace(/#/g, '%23')}")`
  }, [tag])

  const stop = (e) => e.preventDefault()

  return (
    <div
      className={`protected ${className}`}
      onCopy={stop}
      onCut={stop}
      onContextMenu={stop}
      onDragStart={stop}
    >
      {children}
      <div className="protected__wm" aria-hidden="true" style={{ backgroundImage: watermark }} />
      <p className="protected__print">This page can’t be printed. Please view it on Career with Chaitanya.</p>
    </div>
  )
}
