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
                  <p><strong>{gatedCount} more roadmaps are waiting.</strong> Log in (it’s free) to see your interested roadmap guidance.</p>
                  <Link className="btn btn--sm" to="/login?mode=signup">Sign up free</Link>
                </div>
              )}

              <div className="rtools rtools--levels">
                <div className="lvjump" aria-label="Jump to a level">
                  {blocks.map((b) => (
                    <a key={b.id} href={`#level-${b.id}`} className="lvjump__a">{b.title}<span className="ctab__n">{b.items.length}</span></a>
                  ))}
                </div>
                <input className="rsearch" type="search" placeholder="Search roadmaps or tools" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search roadmaps" />
              </div>

              {none ? (
                <div className="card empty"><p>No roadmap matches “{q}”.</p></div>
              ) : (
                blocks.filter((b) => b.items.length > 0).map((b) => (
                  <section key={b.id} id={`level-${b.id}`} className={`level level--${b.id}`}>
                    <header className="level__head">
                      <span className="level__icon"><Icon name={b.id === 'fresher' ? 'sparkle' : 'route'} size={26} /></span>
                      <div>
                        <span className="level__badge">{b.badge}</span>
                        <h2>{b.title} <small>{b.items.length} {b.items.length === 1 ? 'roadmap' : 'roadmaps'}</small></h2>
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
