import { Link } from 'react-router-dom'
import Logo, { Wordmark } from '../components/Logo.jsx'
import Icon from '../components/Icon.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'
import { useApi } from '../lib/useApi.js'

const SIGNUP = '/login?mode=signup'

const FREE = [
  { icon: 'route', title: 'Guidance & roadmaps', text: 'Clear, step-by-step paths to the role you want.' },
  { icon: 'mic', title: 'Free mock interviews', text: 'Practise with a real rubric and honest feedback.' },
  { icon: 'bot', title: 'AI interview', text: 'Basic AI practice, any time you like.' },
  { icon: 'briefcase', title: 'Job openings', text: 'Fresh openings, picked by Chaitanya.' },
  { icon: 'star', title: 'Student stories', text: 'Hear from people who made it.' },
]

const STEPS = [
  { n: '01', title: 'Create a free account', text: 'It takes a minute. No card needed.' },
  { n: '02', title: 'Follow your roadmap', text: 'Know exactly what to learn and in what order.' },
  { n: '03', title: 'Practise and apply', text: 'Mock interviews, AI practice and live openings in one place.' },
]

const PRO = [
  'Video simulation interviews',
  'Next-level AI interview',
  'Bigger job openings',
  'Mock interviews with more features',
]

export default function Landing() {
  const stories = useApi('/testimonials/')
  const list = (stories.data || []).slice(0, 3)

  return (
    <div className="shell land">
      <header className="topbar">
        <div className="topbar__in">
          <Link to="/" className="brand" aria-label="Career with Chaitanya home">
            <Logo size={34} />
            <Wordmark />
          </Link>
          <nav className="tabs land__nav" aria-label="Sections">
            <a className="tab" href="#free">What you get</a>
            <a className="tab" href="#how">How it works</a>
            <a className="tab" href="#pro">Pro</a>
            <a className="tab" href="#stories">Stories</a>
          </nav>
          <div className="user">
            <ThemeToggle />
            <Link to="/login" className="btn btn--ghost btn--sm">Log in</Link>
            <Link to={SIGNUP} className="btn btn--sm land__signup">Sign up free</Link>
          </div>
        </div>
      </header>

      <main className="land__main">
        <section className="hero land__hero">
          <div className="hero__text">
            <span className="eyebrow eyebrow--light">Career with Chaitanya</span>
            <h1>Your road to the offer letter, mapped out.</h1>
            <p>
              Roadmaps, mock interviews, AI practice and job openings, guided by Chaitanya. Start free today and
              upgrade only when you want to go further.
            </p>
            <div className="hero__cta">
              <Link className="btn" to={SIGNUP}>Get started free</Link>
              <Link className="btn btn--cream" to="/login">I already have an account</Link>
            </div>
          </div>
          <div className="hero__art"><Logo size={110} mono /></div>
        </section>

        <section className="section" id="free">
          <div className="section__head">
            <h2>Free, from day one</h2>
            <span className="badge">FREE</span>
          </div>
          <div className="grid grid--5">
            {FREE.map((f) => (
              <Link key={f.title} to={SIGNUP} className="card card--link tile">
                <span className="tile__icon"><Icon name={f.icon} size={22} /></span>
                <h3>{f.title}</h3>
                <p className="muted">{f.text}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="section" id="how">
          <div className="section__head"><h2>How it works</h2></div>
          <ol className="how">
            {STEPS.map((s) => (
              <li key={s.n} className="card how__item">
                <span className="how__n">{s.n}</span>
                <h3>{s.title}</h3>
                <p className="muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="promo land__pro" id="pro">
          <div>
            <span className="eyebrow eyebrow--orange">Pro · ₹499</span>
            <h2>Ready for the next level?</h2>
            <ul className="land__ticks">
              {PRO.map((p) => (
                <li key={p}><Icon name="sparkle" size={15} /> {p}</li>
              ))}
            </ul>
          </div>
          <Link className="btn" to={SIGNUP}>Start free, upgrade later</Link>
        </section>

        {list.length > 0 && (
          <section className="section" id="stories">
            <div className="section__head"><h2>What students say</h2></div>
            <div className="quotes">
              {list.map((t) => (
                <figure key={t.id} className="card quote">
                  <Icon name="quote" size={26} className="quote__mark" />
                  <div className="quote__stars" role="img" aria-label="5 out of 5">
                    {[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={14} />)}
                  </div>
                  <blockquote>{t.quote}</blockquote>
                  <figcaption>
                    <span className="avatar" aria-hidden="true">{t.name[0]}</span>
                    <span><strong>{t.name}</strong><span className="muted">{t.role}</span></span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="land__cta">
          <h2>Your next role starts here</h2>
          <p className="muted">Create your free account and see the full roadmaps, interviews and openings.</p>
          <div className="hero__cta">
            <Link className="btn" to={SIGNUP}>Sign up free</Link>
            <Link className="btn btn--outline" to="/login">Log in</Link>
          </div>
        </section>
      </main>

      <footer className="footer">© {new Date().getFullYear()} Career with Chaitanya</footer>
    </div>
  )
}
