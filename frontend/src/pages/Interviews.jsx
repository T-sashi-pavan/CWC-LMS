import { useToast } from '../context/ToastContext.jsx'
import { useApi } from '../lib/useApi.js'
import { Async, Lock, PageHead, UpgradeLink } from '../components/ui.jsx'

const GROUPS = [
  { kind: 'mock', title: 'Mock interviews', note: 'Free to start, more features in Pro' },
  { kind: 'ai', title: 'AI interview', note: 'Basic is free, next level is Pro' },
  { kind: 'video', title: 'Video simulation', note: 'Pro only' },
]

export default function Interviews() {
  const state = useApi('/interviews/')
  const toast = useToast()
  return (
    <>
      <PageHead eyebrow="Practice" title="Interview practice">
        Rehearse until the real thing feels easy.
      </PageHead>
      <Async state={state}>
        {(list) =>
          GROUPS.map((g) => (
            <section className="section" key={g.kind}>
              <div className="section__head">
                <h2>{g.title}</h2>
                <span className="muted">{g.note}</span>
              </div>
              <div className="grid">
                {list.filter((i) => i.kind === g.kind).map((i) => (
                  <article key={i.id} className={`card ${i.locked ? 'card--locked' : ''}`}>
                    <div className="card__top">
                      <h3>{i.title}</h3>
                      {i.is_pro ? <span className="badge badge--pro">PRO</span> : <span className="badge">FREE</span>}
                    </div>
                    <p className="muted">{i.description}</p>
                    <div className="meta">
                      {i.level && <span className="chip">{i.level}</span>}
                      <span className="chip">{i.duration_min} min</span>
                    </div>
                    {i.locked ? (
                      <div className="locked"><Lock /> <UpgradeLink /></div>
                    ) : (
                      <button className="btn btn--sm" onClick={() => toast('The interview player will be available in the full build.', { title: i.title })}>
                        Start
                      </button>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))
        }
      </Async>
    </>
  )
}
