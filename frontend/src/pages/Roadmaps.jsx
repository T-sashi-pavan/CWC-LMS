import { useApi } from '../lib/useApi.js'
import { Async, Lock, PageHead, UpgradeLink } from '../components/ui.jsx'

export default function Roadmaps() {
  const state = useApi('/roadmaps/')
  return (
    <>
      <PageHead eyebrow="Free guidance" title="Roadmaps to your offer letter">
        Follow a clear path, one milestone at a time.
      </PageHead>
      <Async state={state}>
        {(list) => (
          <div className="grid grid--2">
            {list.map((r) => (
              <article key={r.id} className={`card ${r.locked ? 'card--locked' : ''}`}>
                <div className="card__top">
                  <h3>{r.title}</h3>
                  {r.is_pro ? <span className="badge badge--pro">PRO</span> : <span className="badge">FREE</span>}
                </div>
                <p className="muted">{r.summary}</p>
                {r.duration && <span className="chip">{r.duration}</span>}

                {r.locked ? (
                  <div className="locked">
                    <Lock>Advanced roadmap</Lock>
                    <UpgradeLink />
                  </div>
                ) : (
                  <ol className="steps">
                    {r.steps.map((s, i) => (
                      <li key={i}>
                        <strong>{s.title}</strong>
                        <span className="muted">{s.detail}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </article>
            ))}
          </div>
        )}
      </Async>
    </>
  )
}
