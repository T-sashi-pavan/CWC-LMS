import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export const CATEGORIES = [
  { id: 'all', label: 'All roadmaps' },
  { id: 'ai', label: 'AI & Data Science', icon: 'bot' },
  { id: 'fullstack', label: 'Full Stack', icon: 'route' },
  { id: 'data', label: 'Data & Analytics', icon: 'star' },
  { id: 'cloud', label: 'Cloud, DevOps & Automation', icon: 'sparkle' },
]
export const catIcon = (id) => CATEGORIES.find((c) => c.id === id)?.icon || 'route'
export const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label || ''

// Props for a <Link> that sends a visitor to log in (or sign up) and then straight back to that roadmap.
export const loginLink = (slug, signup = false) => ({
  to: signup ? '/login?mode=signup' : '/login',
  state: { from: { pathname: `/roadmaps/${slug}` } },
})

export default function RoadmapCard({ r, index = 0 }) {
  const gated = r.gated
  const link = gated ? loginLink(r.slug, true) : { to: `/roadmaps/${r.slug}` }
  return (
    <Link {...link} className={`rcard rcard--${r.category} ${gated ? 'is-gated' : ''}`} aria-label={gated ? `${r.title}: log in to view` : r.title}>
      <span className="rcard__art">
        <span className="rcard__no">{String(index + 1).padStart(2, '0')}</span>
        <span className="rcard__icon"><Icon name={gated ? 'lock' : catIcon(r.category)} size={30} /></span>
        <span className="rcard__cat">{catLabel(r.category)}</span>
        {r.highlights?.length > 0 && (
          <span className={`rcard__chips ${gated ? 'is-blur' : ''}`}>
            {r.highlights.slice(0, 4).map((h) => <i key={h}>{h}</i>)}
          </span>
        )}
      </span>
      <span className="rcard__bar">
        <span className="rcard__txt">
          <strong>{r.title}</strong>
          <small>
            {gated
              ? 'Log in to see your roadmap guidance'
              : [r.phase_count && `${r.phase_count} phases`, r.lab_count && `${r.lab_count} labs`].filter(Boolean).join(' · ') || r.tagline}
          </small>
        </span>
        <span className="fcard__arrow"><Icon name={gated ? 'lock' : 'arrow'} size={18} /></span>
      </span>
    </Link>
  )
}
