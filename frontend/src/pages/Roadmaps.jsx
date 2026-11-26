import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../lib/useApi.js'
import { Async, PageHead } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import RoadmapCard from '../components/RoadmapCard.jsx'
import { LEVELS, levelOf } from '../data/roadmapLevels.js'

export default function Roadmaps() {
  const state = useApi('/roadmaps/')
  const [q, setQ] = useState('')
  const [level, setLevel] = useState('fresher')

  return (
    <>
      <PageHead eyebrow="Roadmaps" title="Pick the path to your role">
        Phase-by-phase plans with labs, tools and the roles they lead to. Start with the level that fits you.
      </PageHead>

      <Async state={state}>
        {(list) => {
          const gatedCount = list.filter((r) => r.gated).length
          const term = q.trim().toLowerCase()
          const match = (r) => !term || `${r.title} ${r.tagline} ${(r.highlights || []).join(' ')}`.toLowerCase().includes(term)
          const blocks = LEVELS.map((lv) => ({ ...lv, items: list.filter((r) => levelOf(r.slug) === lv.id && match(r)) }))
          const none = blocks.every((b) => b.items.length === 0)
          return (
            <>
              {gatedCount > 0 && (
                <div className="rgate">
                  <Icon name="lock" size={20} />
                  <p><strong>More roadmaps are waiting.</strong> Log in (it’s free) to see your interested roadmap guidance.</p>
                  <Link className="btn btn--sm" to="/login?mode=signup">Sign up free</Link>
                </div>
              )}

              <nav className="cnav rnav" aria-label="Choose a level">
                <div className="rnav__row">
                  <div className="cnav__list rnav__tabs" role="tablist">
                    {blocks.map((b) => (
                      <button key={b.id} role="tab" aria-selected={level === b.id} className={`cnav__tab ${level === b.id ? 'is-on' : ''}`}
                        onClick={() => setLevel(b.id)}>
                        <span className="rnav__ic"><Icon name={b.id === 'fresher' ? 'sparkle' : 'route'} size={20} /></span>
                        <span className="cnav__txt"><strong>{b.title}</strong><small>{b.badge}</small></span>
                      </button>
                    ))}
                  </div>
                  <input className="rsearch rnav__search" type="search" placeholder="Search roadmaps or tools" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search roadmaps" />
                </div>
              </nav>

              {none ? (
                <div className="card empty"><p>No roadmap matches “{q}”.</p></div>
              ) : (
                blocks.filter((b) => b.items.length > 0 && (term || b.id === level)).map((b) => (
                  <section key={b.id} id={`level-${b.id}`} className={`level level--${b.id}`}>
                    <header className="level__head">
                      <span className="level__icon"><Icon name={b.id === 'fresher' ? 'sparkle' : 'route'} size={26} /></span>
                      <div>
                        <span className="level__badge">{b.badge}</span>
                        <h2>{b.title}</h2>
                        <p className="muted">{b.text}</p>
                      </div>
                    </header>
                    <div className="rgrid">
                      {b.items.map((r) => <RoadmapCard key={r.id} r={r} index={list.indexOf(r)} />)}
                    </div>
                  </section>
                ))
              )}
            </>
          )
        }}
      </Async>
    </>
  )
}
