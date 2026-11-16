import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { SectionHead } from './ui.jsx'
import { CARDS } from '../data/homeContent.js'
import { COMPANIES } from '../data/companies.js'
import { STUDENTS } from '../data/students.js'

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
  () => (
    <span className="art art--crack">
      <span className="art__card"><Icon name="briefcase" size={54} /></span>
      <span className="logos4" aria-hidden="true">
        {['google', 'amazon', 'microsoft', 'tcs'].map((id) => <i key={id}><img src={`/logos/${id}.svg`} alt="" loading="lazy" /></i>)}
      </span>
    </span>
  ),
]

// Three big product cards. `compact` is the slimmer logged-in version.
export function FeatureCards({
  compact = false,
  eyebrow = 'What you get',
  title = 'Four ways to get job-ready',
  sub = 'Practise speaking, rehearse interviews, follow a plan and study each company.',
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

// Teaser for the Crack the Company guide plus a few students, shown on the public home page.
export function CrackPreview() {
  const faces = STUDENTS.filter((s) => s.photo).slice(0, 6)
  return (
    <section className="section">
      <SectionHead eyebrow="Crack the Company" title="Know the interview before you walk in" sub="Hiring process, rounds, questions and prep tips for top companies." />
      <div className="cpv">
        {COMPANIES.slice(0, 6).map((c) => (
          <Link key={c.id} to={`/crack-company?c=${c.id}`} className="cpv__card">
            <span className="cpv__logo"><img src={c.logo} alt={`${c.name} logo`} loading="lazy" /></span>
            <strong>{c.name}</strong>
            <small>{c.tagline}</small>
            <span className="cpv__go">Read the guide <Icon name="arrow" size={14} /></span>
          </Link>
        ))}
      </div>
      <div className="cpv__foot">
        <div className="cpv__faces">
          <span className="cpv__stack">
            {faces.map((s) => <img key={s.id} src={s.photo} alt={s.name} loading="lazy" />)}
          </span>
          <span><strong>Students like these</strong> cracked their interviews with Chaitanya's guidance.</span>
        </div>
        <Link className="btn" to="/crack-company">Explore all companies <Icon name="arrow" size={16} /></Link>
      </div>
    </section>
  )
}
