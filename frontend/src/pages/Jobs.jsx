import { useToast } from '../context/ToastContext.jsx'
import { useApi } from '../lib/useApi.js'
import { Async, Lock, PageHead, UpgradeLink } from '../components/ui.jsx'

export default function Jobs() {
  const state = useApi('/jobs/')
  const toast = useToast()
  return (
    <>
      <PageHead eyebrow="Opportunities" title="Job openings">
        Free openings for everyone. Pro unlocks the bigger ones.
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
                ) : (
                  <button className="btn btn--sm" onClick={() => toast('Applying will be available very soon.', { title: j.title })}>Apply</button>
                )}
              </article>
            ))}
          </div>
        )}
      </Async>
    </>
  )
}
