import { useApi } from '../lib/useApi.js'
import { Async, PageHead } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'

function Quote({ t, feature }) {
  return (
    <figure className={`card quote ${feature ? 'quote--feature' : ''}`}>
      <Icon name="quote" size={feature ? 34 : 26} className="quote__mark" />
      <div className="quote__stars" role="img" aria-label="5 out of 5">
        {[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={14} />)}
      </div>
      <blockquote>{t.quote}</blockquote>
      <figcaption>
        <span className="avatar" aria-hidden="true">{t.name[0]}</span>
        <span><strong>{t.name}</strong><span className="muted">{t.role}</span></span>
      </figcaption>
    </figure>
  )
}

export default function Testimonials() {
  const state = useApi('/testimonials/')
  return (
    <>
      <PageHead eyebrow="Proof" title="What students say">
        Real journeys from people who followed the roadmap.
      </PageHead>
      <Async state={state}>
        {(list) => (
          <div className="quotes">
            {list.map((t, i) => <Quote key={t.id} t={t} feature={i === 0} />)}
          </div>
        )}
      </Async>
    </>
  )
}
