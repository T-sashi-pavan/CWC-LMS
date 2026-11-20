import { Link } from 'react-router-dom'
import { PageHead } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'

const TRACKS = [
  { id: 'fresher', icon: 'sparkle', title: 'Freshers', to: '/course-tracks/freshers', text: 'Job-ready courses that take you from the basics to your first offer letter, with projects and mock interviews.' },
  { id: 'experienced', icon: 'route', title: 'Experienced', soon: true, text: 'Upskill, move into AI and cloud roles, and switch to a higher-paying job with guided, hands-on learning.' },
]

// Step 1 of the Courses Hub: pick a level. Freshers opens the course list; Experienced is not launched yet.
export default function CourseTracks() {
  return (
    <>
      <PageHead eyebrow="Courses Hub" title="Choose your level">
        Pick the track that matches where you are today.
      </PageHead>
      <div className="ctrack">
        {TRACKS.map((t) => {
          const body = (
            <>
              <span className="ctrack__icon"><Icon name={t.icon} size={28} /></span>
              {t.soon ? <span className="ctrack__soon">Coming soon</span> : <span className="ctrack__soon ctrack__soon--live">Open for enrolment</span>}
              <h2>{t.title}</h2>
              <p>{t.text}</p>
              {!t.soon && <span className="ctrack__go">View courses <Icon name="arrow" size={16} /></span>}
            </>
          )
          return t.soon ? (
            <article key={t.id} className={`ctrack__card ctrack__card--${t.id} ctrack__card--off`} aria-disabled="true">{body}</article>
          ) : (
            <Link key={t.id} to={t.to} className={`ctrack__card ctrack__card--${t.id} ctrack__card--link`}>{body}</Link>
          )
        })}
      </div>
      <div className="ctrack__free">
        <span>Want to start learning today?</span>
        <Link className="btn btn--sm" to="/courses">Free course videos <Icon name="arrow" size={15} /></Link>
        <Link className="btn btn--sm btn--outline" to="/roadmaps">Roadmaps</Link>
      </div>
    </>
  )
}
