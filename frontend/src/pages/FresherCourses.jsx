import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHead } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { FRESHER_COURSES, PLANS, PLAN_ROWS } from '../data/plans.js'

function Cell({ v }) {
  if (v === true) return <span className="pcmp__yes"><Icon name="check" size={16} /><span className="sr">Included</span></span>
  if (v === false) return <span className="pcmp__no"><Icon name="minus" size={16} /><span className="sr">Not included</span></span>
  return <span className="pcmp__txt">{v}</span>
}

// Step 2: the five fresher courses. "Know more about the curriculum" reveals the two plans side by side.
export default function FresherCourses() {
  const [open, setOpen] = useState(false)
  const plans = useRef(null)

  const reveal = () => {
    setOpen(true)
    // wait for the block to render, then bring it into view
    requestAnimationFrame(() => plans.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <>
      <div className="track-switch" role="tablist" aria-label="Course track">
        <span className="track-switch__btn track-switch__btn--active" role="tab" aria-selected="true">
          Freshers
        </span>
        <Link to="/course-tracks/experienced" className="track-switch__btn" role="tab" aria-selected="false">
          Experienced <small>Soon</small>
        </Link>
      </div>
      <PageHead eyebrow="Freshers" title="Courses for your first role">
        Five job-focused tracks. Each one builds from the basics to projects and interview practice.
      </PageHead>

      <div className="fcg">
        {FRESHER_COURSES.map((c) => (
          <article key={c.id} className="fcg__card">
            <span className="fcg__icon"><Icon name={c.icon} size={26} /></span>
            <h2>{c.title}</h2>
            <p>{c.text}</p>
            <ul className="fcg__topics">
              {c.topics.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </article>
        ))}
      </div>

      <section className="cmore">
        <div>
          <h2>Do you want to know more about the curriculum?</h2>
          <p>See what each plan includes and pick the one that fits you.</p>
        </div>
        {!open && (
          <button type="button" className="btn btn--lg" onClick={reveal}>
            Know more <Icon name="arrow" size={18} />
          </button>
        )}
      </section>

      {open && (
        <section className="cplans" ref={plans} aria-label="Plans">
          <div className="cplans__grid">
            {PLANS.map((p) => (
              <article key={p.id} className={`cplan ${p.best ? 'cplan--best' : ''}`}>
                {p.best && <span className="cplan__flag">Full program</span>}
                <h3>{p.name}</h3>
                <p className="cplan__price"><strong>{p.price}</strong> <span>{p.per}</span></p>
                <p className="cplan__who">{p.who}</p>
                <ul className="pcmp">
                  {PLAN_ROWS.map((r) => (
                    <li key={r.label} className={r[p.key] === false ? 'is-off' : ''}>
                      <span className="pcmp__label">{r.label}</span>
                      <Cell v={r[p.key]} />
                    </li>
                  ))}
                </ul>
                <a className={`btn btn--lg cplan__cta ${p.best ? '' : 'btn--outline'}`} href={p.form} target="_blank" rel="noopener noreferrer">
                  Click to start <Icon name="arrow" size={18} />
                </a>
              </article>
            ))}
          </div>
          <p className="cplans__note">
            Referrals, company exposure and internships depend on openings, employer participation and your eligibility.
            They are not a guarantee of an interview, internship or job offer. Company drives are simulations unless stated otherwise.
          </p>
        </section>
      )}
    </>
  )
}
