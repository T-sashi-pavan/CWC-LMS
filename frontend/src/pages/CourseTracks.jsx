import { Link } from 'react-router-dom'
import { PageHead } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'

const TRACKS = [
  { id: 'fresher', icon: 'sparkle', title: 'Freshers', text: 'Job-ready courses that take you from the basics to your first offer letter, with projects and mock interviews.' },
  { id: 'experienced', icon: 'route', title: 'Experienced', text: 'Upskill, move into AI and cloud roles, and switch to a higher-paying job with guided, hands-on learning.' },
]

// Paid course tracks are not launched yet: two blocks that say "Coming soon", plus a pointer to the free videos.
export default function CourseTracks() {
  return (
    <>
      <PageHead eyebrow="Courses" title="Courses are coming soon">
        We are building structured courses for two kinds of learners. Until they launch, the free playlists and roadmaps are open to everyone.
      </PageHead>
      <div className="ctrack">
        {TRACKS.map((t) => (
          <article key={t.id} className={`ctrack__card ctrack__card--${t.id}`}>
            <span className="ctrack__icon"><Icon name={t.icon} size={28} /></span>
            <span className="ctrack__soon">Coming soon</span>
            <h2>{t.title}</h2>
            <p>{t.text}</p>
          </article>
        ))}
      </div>
      <div className="ctrack__free">
        <span>Want to start learning today?</span>
        <Link className="btn btn--sm" to="/courses">Free course videos <Icon name="arrow" size={15} /></Link>
        <Link className="btn btn--sm btn--outline" to="/roadmaps">Roadmaps</Link>
      </div>
    </>
  )
}
