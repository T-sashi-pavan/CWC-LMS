import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { progress } from '../lib/progress.js'
import { PageHead, SectionHead } from '../components/ui.jsx'
import { ROUNDS } from '../data/homeContent.js'
import { SIMULATOR_FORM } from '../data/plans.js'

export default function InterviewSimulator() {
  useEffect(() => { progress.visit('simulator') }, [])
  return (
    <>
      <PageHead eyebrow="Mock interview" title="Interview Simulator">
        Go through the full hiring process in five rounds, then sit down for a personal review.
      </PageHead>

      <section className="section">
        <SectionHead eyebrow="The journey" title="Five rounds, one clear path" />
        <ol className="path">
          {ROUNDS.map((r) => (
            <li key={r.n} className={`path__step ${r.n === ROUNDS.length ? 'is-last' : ''}`}>
              <span className="path__n">{r.n}</span>
              <div className="path__card">
                <h3>{r.title}</h3>
                <p className="muted">{r.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bigcta">
        <h2>Ready to take the first round?</h2>
        <p>Register for the Interview Simulator and get honest, rubric-based feedback.</p>
        <div className="hero__cta">
          <a className="btn btn--lg" href={SIMULATOR_FORM} target="_blank" rel="noopener noreferrer">Register now</a>
          <Link className="btn btn--cream btn--lg" to="/interviews">Start practising</Link>
        </div>
      </section>
    </>
  )
}
