import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useApi } from '../lib/useApi.js'
import { Async, Lock, PageHead, UpgradeLink } from '../components/ui.jsx'

const LEVELS = [
  { id: 'fresher', title: 'Freshers', sub: 'Fresher jobs', empty: 'No fresher jobs match these filters.' },
  { id: 'experienced', title: 'Experienced', sub: 'Roles asking for 1 year or more', empty: 'No experienced jobs match these filters.' },
]
const PAGE = 20
const DAY = 86400000

// 'YYYY-MM-DD' -> a local Date (no timezone shift)
const toDate = (s) => { if (!s) return null; const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
const fmt = (s, long) => { const d = toDate(s); return d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', ...(long ? { year: 'numeric' } : {}) }) : '' }
const daysAgo = (s) => { const d = toDate(s); if (!d) return Infinity; const t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((t - d) / DAY) }
// "Hyderabad / Remote" or "Pune, Maharashtra" -> ['Hyderabad', 'Remote'] so each city is its own filter value
const places = (loc) => (loc || '').split(/[,/|;()]| or /i).map((x) => x.trim()).filter((x) => x && x.length < 30)

const RECENT = [
  { id: '', label: 'Any date' },
  { id: 'r2', label: 'Last 2 days', max: 2 },
  { id: 'r7', label: 'Last 7 days', max: 7 },
  { id: 'r14', label: 'Last 14 days', max: 14 },
]

// How a signed-in member can apply; visitors are sent to sign up and come back to /jobs.
function Apply({ j, user, loading }) {
  if (j.locked) return <div className="locked"><Lock /> <UpgradeLink>Unlock</UpgradeLink></div>
  if (loading) return null
  if (!user || j.login_required) {
    return <Link className="btn btn--sm" to="/login?mode=signup" state={{ from: { pathname: '/jobs' } }}>Apply</Link>
  }
  const mail = j.apply_email && `mailto:${j.apply_email}?subject=${encodeURIComponent(`Application: ${j.title} at ${j.company}`)}`
  if (!j.apply_url && !mail && !j.apply_note) return <span className="chip">Apply link coming soon</span>
  return (
    <>
      {j.apply_url && <a className="btn btn--sm" href={j.apply_url} target="_blank" rel="noopener noreferrer">Apply</a>}
      {mail && <a className={`btn btn--sm ${j.apply_url ? 'btn--outline' : ''}`} href={mail}>{j.apply_url ? 'Email HR' : 'Apply by email'}</a>}
      {j.apply_note && <span className="chip" title="HR contact">HR: {j.apply_note}</span>}
    </>
  )
}

function JobModal({ j, user, loading, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose])
  const skills = j.skills || []
  return (
    <div className="jmodal" role="dialog" aria-modal="true" aria-label={`${j.title} at ${j.company}`} onClick={onClose}>
      <div className="jmodal__box" onClick={(e) => e.stopPropagation()}>
        <button className="jmodal__close" type="button" onClick={onClose} aria-label="Close">×</button>
        <span className="eyebrow">{j.level === 'experienced' ? 'Experienced' : 'Fresher'} job</span>
        <h2>{j.title}</h2>
        <p className="muted jmodal__co">{[j.company, j.location].filter(Boolean).join(' · ')}</p>
        <dl className="jmodal__facts">
          <div><dt>Job type</dt><dd>{j.job_type}</dd></div>
          {j.experience && <div><dt>Experience</dt><dd>{j.experience}</dd></div>}
          {j.location && <div><dt>Location</dt><dd>{j.location}</dd></div>}
          {j.salary && <div><dt>Salary</dt><dd>{j.salary}</dd></div>}
          {j.posted_at && <div><dt>Posted</dt><dd>{fmt(j.posted_at, true)}</dd></div>}
        </dl>
        {skills.length > 0 && (
          <section>
            <h3>Roles and responsibilities</h3>
            <div className="job__tags">{skills.map((x) => <span key={x} className="tag">{x}</span>)}</div>
          </section>
        )}
        {j.description && <section><h3>Roles and responsibilities</h3><p className="jmodal__text">{j.description}</p></section>}
        <div className="jmodal__act"><Apply j={j} user={user} loading={loading} /></div>
      </div>
    </div>
  )
}

export default function Jobs() {
  const state = useApi('/jobs/')
  const { user, loading } = useAuth()
  const [params, setParams] = useSearchParams()
  const level = params.get('level') === 'experienced' ? 'experienced' : 'fresher'
  const pick = (id) => setParams(id === 'fresher' ? {} : { level: id }, { replace: true })

  const [f, setF] = useState({ q: '', date: '', loc: '', type: '' })
  const [shown, setShown] = useState(PAGE)
  const [open, setOpen] = useState(null)
  const set = (k) => (e) => { setF((p) => ({ ...p, [k]: e.target.value })); setShown(PAGE) }
  const active = f.q || f.date || f.loc || f.type
  const clear = () => { setF({ q: '', date: '', loc: '', type: '' }); setShown(PAGE) }

  const all = state.data
  const options = useMemo(() => {
    const list = Array.isArray(all) ? all : []
    const locs = {}
    const types = new Set()
    const dates = new Set()
    list.forEach((j) => { places(j.location).forEach((p) => { locs[p] = (locs[p] || 0) + 1 }); types.add(j.job_type); if (j.posted_at) dates.add(j.posted_at) })
    return {
      locs: Object.entries(locs).sort((a, b) => b[1] - a[1]).slice(0, 40).map(([p]) => p).sort(),
      types: [...types].filter(Boolean).sort(),
      dates: [...dates].sort().reverse(),
    }
  }, [all])

  const matches = useMemo(() => {
    const list = Array.isArray(all) ? all : []
    const q = f.q.trim().toLowerCase()
    const recent = RECENT.find((r) => r.id === f.date)
    return list.filter((j) => {
      if (q && !`${j.title} ${j.company} ${j.location} ${(j.skills || []).join(' ')}`.toLowerCase().includes(q)) return false
      if (f.loc && !places(j.location).includes(f.loc)) return false
      if (f.type && j.job_type !== f.type) return false
      if (f.date) {
        if (recent?.max) { if (daysAgo(j.posted_at) > recent.max) return false } else if (j.posted_at !== f.date) return false
      }
      return true
    })
  }, [all, f])

  const levelOf = (j) => j.level || 'fresher'
  const count = (id) => matches.filter((j) => levelOf(j) === id).length
  const list = matches.filter((j) => levelOf(j) === level)

  return (
    <>
      <PageHead eyebrow="Opportunities" title="Job openings">
        {user
          ? 'Fresh openings for freshers and early-career candidates. Apply straight from the listing.'
          : 'Fresh openings for freshers and early-career candidates. Create a free account to apply.'}
      </PageHead>
      <Async state={state}>
        {() => (
          <>
            <div className="jobtabs" role="tablist" aria-label="Job level">
              {LEVELS.map((l) => (
                <button key={l.id} type="button" role="tab" aria-selected={level === l.id}
                  className={`jobtab ${level === l.id ? 'is-on' : ''}`} onClick={() => { pick(l.id); setShown(PAGE) }}>
                  <span className="jobtab__t">{l.title}<b>{count(l.id)}</b></span>
                  <span className="jobtab__s">{l.sub}</span>
                </button>
              ))}
            </div>

            <div className="jobfilters" role="search">
              <input className="jobfilters__q" type="search" placeholder="Search role, company or skill" value={f.q} onChange={set('q')} aria-label="Search jobs" />
              <select value={f.date} onChange={set('date')} aria-label="Posted date">
                <optgroup label="Posted">
                  {RECENT.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                </optgroup>
                {options.dates.length > 0 && (
                  <optgroup label="On a specific day">
                    {options.dates.map((d) => <option key={d} value={d}>{fmt(d, true)}</option>)}
                  </optgroup>
                )}
              </select>
              <select value={f.loc} onChange={set('loc')} aria-label="Location">
                <option value="">All locations</option>
                {options.locs.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <select value={f.type} onChange={set('type')} aria-label="Job type">
                <option value="">All types</option>
                {options.types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <button type="button" className="btn btn--sm btn--outline jobfilters__clear" onClick={clear} disabled={!active}>Clear</button>
            </div>

            <p className="muted jobs__count" aria-live="polite">
              {list.length} {list.length === 1 ? 'job' : 'jobs'}{active ? ' match your filters' : ''}
            </p>
            {list.length === 0 && <p className="muted jobtabs__empty">{LEVELS.find((l) => l.id === level).empty}</p>}

            <div className="list">
              {list.slice(0, shown).map((j) => {
                const skills = j.skills || []
                return (
                  <article key={j.id} className={`card job job--row job--click ${j.locked ? 'card--locked' : ''}`}
                    role="button" tabIndex={0} aria-label={`View details: ${j.title} at ${j.company}`}
                    onClick={() => setOpen(j)}
                    onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) { e.preventDefault(); setOpen(j) } }}>
                    <div className="job__main">
                      <h3>{j.title}</h3>
                      <p className="muted">{[j.company, j.location].filter(Boolean).join(' · ')}</p>
                      <div className="meta">
                        <span className="chip">{j.job_type}</span>
                        {j.experience && <span className="chip">{j.experience}</span>}
                        {j.salary && <span className="chip">{j.salary}</span>}
                        {j.posted_at && <span className="chip chip--date">{fmt(j.posted_at)}</span>}
                        {j.is_pro && <span className="badge badge--pro">PRO</span>}
                      </div>
                      {skills.length > 0 && (
                        <div className="job__tags">
                          {skills.slice(0, 4).map((x) => <span key={x} className="tag">{x}</span>)}
                          {skills.length > 4 && <span className="job__more">+{skills.length - 4} more</span>}
                        </div>
                      )}
                    </div>
                    <div className="job__act" onClick={(e) => e.stopPropagation()}>
                      <Apply j={j} user={user} loading={loading} />
                    </div>
                  </article>
                )
              })}
            </div>
            {list.length > shown && (
              <div className="jobs__more">
                <button type="button" className="btn btn--outline" onClick={() => setShown((n) => n + PAGE)}>
                  Show more ({list.length - shown} left)
                </button>
              </div>
            )}
          </>
        )}
      </Async>
      {open && <JobModal j={open} user={user} loading={loading} onClose={() => setOpen(null)} />}
    </>
  )
}
