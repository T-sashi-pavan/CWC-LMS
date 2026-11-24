import { Link } from 'react-router-dom'
import { PageHead } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'

const EXPERIENCED_BLOCKS = [
  {
    id: 'domain-shift',
    icon: 'route',
    title: 'Domain Shift Track',
    badge: 'Coming soon',
    text: 'Transition smoothly from non-IT, support, or legacy roles into high-growth domains like AI/ML, Full Stack, or Data Engineering.',
    topics: ['Role-gap assessment', 'Hands-on migration projects', 'Portfolio & resume repositioning'],
  },
  {
    id: 'career-upshift',
    icon: 'sparkle',
    title: 'Career Upshift & Senior Prep',
    badge: 'Coming soon',
    text: 'Level up from 1–4+ years of experience into top product and service companies with structured mentorship.',
    topics: ['System design & architecture', 'Senior-level mock interviews', 'Salary & offer negotiation'],
  },
]

export default function ExperiencedCourses() {
  return (
    <>
      <div className="track-switch" role="tablist" aria-label="Course track">
        <Link to="/course-tracks/freshers" className="track-switch__btn" role="tab" aria-selected="false">
          Freshers
        </Link>
        <span className="track-switch__btn track-switch__btn--active" role="tab" aria-selected="true">
          Experienced <small>Soon</small>
        </span>
      </div>

      <PageHead eyebrow="Experienced" title="Upshift & Domain Shift">
        Dedicated tracks for working professionals looking to switch domains or accelerate their career.
      </PageHead>

      <div className="exp-grid">
        {EXPERIENCED_BLOCKS.map((b) => (
          <article key={b.id} className="exp-card">
            <div className="exp-card__top">
              <span className="fcg__icon"><Icon name={b.icon} size={26} /></span>
              <span className="ctrack__soon">{b.badge}</span>
            </div>
            <h2>{b.title}</h2>
            <p>{b.text}</p>
            <ul className="fcg__topics">
              {b.topics.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </article>
        ))}
      </div>

      <div className="ctrack__free">
        <span>Looking for fresher-friendly courses instead?</span>
        <Link className="btn btn--sm" to="/course-tracks/freshers">
          View Fresher Courses <Icon name="arrow" size={15} />
        </Link>
        <Link className="btn btn--sm btn--outline" to="/roadmaps">Roadmaps</Link>
      </div>
    </>
  )
}

