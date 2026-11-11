import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { SectionHead } from './ui.jsx'
import { CARDS } from '../data/homeContent.js'

const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

// Illustrated tile art for the three product cards (pure CSS/SVG, no image files).
const ART = [
  () => (
    <span className="art art--mic">
      <span className="art__card"><Icon name="mic" size={58} /></span>
      <span className="eq" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></span>
    </span>
  ),
  () => (
    <span className="art art--sim">
      <span className="art__card"><Icon name="bot" size={58} /></span>
      <span className="rounds5" aria-hidden="true"><b>1</b><b>2</b><b>3</b><b>4</b><b>5</b></span>
    </span>
  ),
  () => (
    <span className="art art--road">
      <svg viewBox="0 0 220 120" aria-hidden="true">
        <path className="art__path" d="M10 100 C60 100 40 30 100 30 S150 95 210 20" />
        <circle cx="10" cy="100" r="7" /><circle cx="100" cy="30" r="7" /><circle cx="210" cy="20" r="9" className="art__goal" />
      </svg>
      <span className="art__card"><Icon name="route" size={50} /></span>
    </span>
  ),
]

// Three big product cards. `compact` is the slimmer logged-in version.
export function FeatureCards({
  compact = false,
  eyebrow = 'What you get',
  title = 'Three ways to get job-ready',
  sub = 'Practise speaking, rehearse interviews and follow a plan.',
}) {
  return (
    <section className="section">
      {!compact && <SectionHead eyebrow={eyebrow} title={title} sub={sub} />}
      <div className={`fcards ${compact ? 'fcards--compact' : ''}`}>
        {CARDS.map((c, i) => {
          const Art = ART[i]
          return (
            <Link key={c.to} to={c.to} className={`fcard fcard--${i}`} onMouseMove={spot}>
              <Art />
              <span className="fcard__bar">
                <span className="fcard__txt"><strong>{c.title}</strong><small>{c.text}</small></span>
                <span className="fcard__arrow"><Icon name="arrow" size={18} /></span>
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
