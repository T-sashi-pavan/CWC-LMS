import { useToast } from '../context/ToastContext.jsx'
import { useApi } from '../lib/useApi.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Async, PageHead } from '../components/ui.jsx'

export default function Pro() {
  const { isPro } = useAuth()
  const state = useApi('/plans/')
  const toast = useToast()
  return (
    <>
      <PageHead eyebrow="Plans" title="Start free, grow with Pro">
        Everything you need to begin is free. Pro takes you to the next level.
      </PageHead>
      <Async state={state}>
        {(plans) => (
          <div className="grid grid--2 plans">
            {plans.map((p) => {
              const pro = p.id === 'pro'
              const current = pro === isPro
              return (
                <article key={p.id} className={`card plan ${pro ? 'plan--pro' : ''}`}>
                  <div className="plan__head">
                    <h3>{p.name}</h3>
                    {pro && <span className="badge badge--pro">BEST VALUE</span>}
                  </div>
                  <p className="plan__price">
                    <strong>{p.price === 0 ? '₹0' : `₹${p.price}`}</strong>
                    <span>{pro ? ' / month' : ' forever'}</span>
                  </p>
                  <ul className="ticks">
                    {p.features.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                  <button
                    className={`btn btn--block ${pro ? '' : 'btn--outline'}`}
                    disabled={current}
                    onClick={() => pro && toast('Online payment for Pro (₹499) will be connected in the full build.', { title: 'Subscription coming soon' })}
                  >
                    {current ? 'Your current plan' : pro ? 'Upgrade to Pro' : 'Free plan'}
                  </button>
                </article>
              )
            })}
          </div>
        )}
      </Async>
    </>
  )
}
