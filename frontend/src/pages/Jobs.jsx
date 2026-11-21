import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useApi } from '../lib/useApi.js'
import { Async, Lock, PageHead, UpgradeLink } from '../components/ui.jsx'

export default function Jobs() {
  const state = useApi('/jobs/')
  const { user, loading } = useAuth()
  return (
    <>
      <PageHead eyebrow="Opportunities" title="Job openings">
        {user
          ? 'Fresh openings for freshers and early-career candidates. Apply straight from the listing.'
          : 'Fresh openings for freshers and early-career candidates. Create a free account to apply.'}
      </PageHead>
      <Async state={state}>
        {(list) => (
          <div className="list">
            {list.map((j) => (
              <article key={j.id} className={`card job job--row ${j.locked ? 'card--locked' : ''}`}>
                <div className="job__main">
                  <h3>{j.title}</h3>
                  <p className="muted">{j.company} · {j.location}</p>
                  <div className="meta">
                    <span className="chip">{j.job_type}</span>
                    {j.salary && <span className="chip">{j.salary}</span>}
                    {j.is_pro && <span className="badge badge--pro">PRO</span>}
                  </div>
                </div>
                {j.locked ? (
                  <div className="locked"><Lock /> <UpgradeLink>Unlock</UpgradeLink></div>
                ) : loading ? null : !user || j.login_required ? (
                  // visitors can browse every opening; applying needs a free account (they come back to /jobs after signing up)
                  <Link className="btn btn--sm" to="/login?mode=signup" state={{ from: { pathname: '/jobs' } }}>Apply</Link>
                ) : j.apply_url ? (
                  <a className="btn btn--sm" href={j.apply_url} target="_blank" rel="noopener noreferrer">Apply</a>
                ) : (
                  <span className="chip">Apply link coming soon</span>
                )}
              </article>
            ))}
          </div>
        )}
      </Async>
    </>
  )
}
