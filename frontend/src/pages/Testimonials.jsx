import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHead } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { StudentStories, StudentWall } from '../components/StudentStories.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { STORIES, STUDENTS, TRACK_LABEL } from '../data/students.js'

export default function Testimonials() {
  const { user } = useAuth()
  const [track, setTrack] = useState('all')

  const tracks = useMemo(() => [...new Set(STORIES.map((s) => s.track))].filter((t) => TRACK_LABEL[t]), [])
  const list = track === 'all' ? STORIES : STORIES.filter((s) => s.track === track)

  return (
    <>
      <PageHead eyebrow="Testimonials" title="Stories from our students">
        Real students, real progress. Watch how they learned, practised and moved forward with Career with Chaitanya.
      </PageHead>

      <section className="strip" aria-label="Community at a glance">
        <div><strong>{STORIES.length}</strong><span>video stories</span></div>
        <div><strong>{STUDENTS.length}</strong><span>students in the community</span></div>
        <div><strong>{tracks.length}</strong><span>learning paths</span></div>
        <div><strong>Free</strong><span>to join and learn</span></div>
      </section>

      <div className="rtools">
        <div className="ctabs" role="tablist" aria-label="Filter by learning path">
          <button role="tab" aria-selected={track === 'all'} className={`ctab ${track === 'all' ? 'is-on' : ''}`} onClick={() => setTrack('all')}>
            All stories<span className="ctab__n">{STORIES.length}</span>
          </button>
          {tracks.map((t) => (
            <button key={t} role="tab" aria-selected={track === t} className={`ctab ${track === t ? 'is-on' : ''}`} onClick={() => setTrack(t)}>
              {TRACK_LABEL[t]}<span className="ctab__n">{STORIES.filter((s) => s.track === t).length}</span>
            </button>
          ))}
        </div>
      </div>

      <StudentStories grid list={list} title="Watch their stories" sub="Tap a story to watch it full screen, then swipe through the rest." />
      <StudentWall />

      <section className="bigcta">
        <h2>Be our next success story.</h2>
        <p>{user ? 'Pick a roadmap, follow the lessons and share your own journey.' : 'Create a free account and start your own journey today.'}</p>
        <div className="hero__cta">
          {user
            ? <Link className="btn btn--lg" to="/roadmaps">Choose your roadmap <Icon name="arrow" size={18} /></Link>
            : <><Link className="btn btn--lg" to="/login?mode=signup">Sign up free</Link><Link className="btn btn--cream btn--lg" to="/roadmaps">See roadmaps</Link></>}
        </div>
      </section>
    </>
  )
}
