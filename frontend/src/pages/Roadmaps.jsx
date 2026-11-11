import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../lib/useApi.js'
import { Async, PageHead } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import RoadmapCard, { CATEGORIES } from '../components/RoadmapCard.jsx'

export default function Roadmaps() {
  const state = useApi('/roadmaps/')
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')

  return (
    <>
      <PageHead eyebrow="Roadmaps" title="Pick the path to your role">
        Phase-by-phase plans with labs, tools and the roles they lead to. Choose the one that fits where you want to go.
      </PageHead>

      <Async state={state}>
        {(list) => {
          const gatedCount = list.filter((r) => r.gated).length
          const visible = list.filter(
            (r) =>
              (cat === 'all' || r.category === cat) &&
              (!q.trim() || `${r.title} ${r.tagline} ${(r.highlights || []).join(' ')}`.toLowerCase().includes(q.trim().toLowerCase())),
          )
          const count = (id) => (id === 'all' ? list.length : list.filter((r) => r.category === id).length)
          return (
            <>
              {gatedCount > 0 && (
                <div className="rgate">
                  <Icon name="lock" size={20} />
                  <p><strong>{gatedCount} more roadmaps are waiting.</strong> Log in (it’s free) to see your interested roadmap guidance.</p>
                  <Link className="btn btn--sm" to="/login?mode=signup">Sign up free</Link>
                </div>
              )}

              <div className="rtools">
                <div className="ctabs" role="tablist" aria-label="Roadmap categories">
                  {CATEGORIES.filter((c) => count(c.id) > 0).map((c) => (
                    <button key={c.id} role="tab" aria-selected={cat === c.id} className={`ctab ${cat === c.id ? 'is-on' : ''}`} onClick={() => setCat(c.id)}>
                      {c.label}<span className="ctab__n">{count(c.id)}</span>
                    </button>
                  ))}
                </div>
                <input className="rsearch" type="search" placeholder="Search roadmaps or tools" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search roadmaps" />
              </div>

              {visible.length === 0 ? (
                <div className="card empty"><p>No roadmap matches “{q}”.</p></div>
              ) : (
                <div className="rgrid">
                  {visible.map((r, i) => <RoadmapCard key={r.id} r={r} index={list.indexOf(r)} />)}
                </div>
              )}
            </>
          )
        }}
      </Async>
    </>
  )
}
