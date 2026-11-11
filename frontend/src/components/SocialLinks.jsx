import Icon from './Icon.jsx'
import { SOCIAL } from '../data/site.js'

const ICONS = {
  youtube: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z" /></svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z" /></svg>
  ),
}

// variant "icons": round icon buttons (footer). variant "cards": big link cards (About page).
export default function SocialLinks({ variant = 'icons' }) {
  if (variant === 'cards') {
    return (
      <div className="soc-cards">
        {SOCIAL.map((s) => (
          <a key={s.key} className={`soc-card soc-card--${s.key}`} href={s.url} target="_blank" rel="noopener noreferrer">
            <span className="soc-card__icon">{ICONS[s.key]}</span>
            <span className="soc-card__txt"><strong>{s.label}</strong><small>{s.handle}</small></span>
            <span className="soc-card__desc">{s.text}</span>
            <span className="soc-card__go">Follow <Icon name="arrow" size={15} /></span>
          </a>
        ))}
      </div>
    )
  }
  return (
    <ul className="soc-icons" aria-label="Follow Career with Chaitanya">
      {SOCIAL.map((s) => (
        <li key={s.key}>
          <a className={`soc-icon soc-icon--${s.key}`} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`${s.label}: ${s.handle}`} title={s.label}>
            {ICONS[s.key]}
          </a>
        </li>
      ))}
    </ul>
  )
}
