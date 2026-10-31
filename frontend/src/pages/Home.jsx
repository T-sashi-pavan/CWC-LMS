import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useApi } from '../lib/useApi.js'
import { Async, Lock } from '../components/ui.jsx'
import Logo from '../components/Logo.jsx'
import Icon from '../components/Icon.jsx'

const FREE = [
  { to: '/roadmaps', icon: 'route', title: 'Free guidance & roadmaps', text: 'Step-by-step paths to the role you want.' },
  { to: '/interviews', icon: 'mic', title: 'Free mock interviews', text: 'Practise with a real rubric and feedback.' },
  { to: '/interviews', icon: 'bot', title: 'AI interview', text: 'Basic AI practice, any time you like.' },
  { to: '/jobs', icon: 'briefcase', title: 'Job openings', text: 'Fresh openings picked by Chaitanya.' },
  { to: '/testimonials', icon: 'star', title: 'Testimonials', text: 'Hear from students who made it.' },
]

export default function Home() {
  const { displayName, isPro } = useAuth()
  const jobs = useApi('/jobs/')

  return (
    <>
      <section className="hero">
        <div className="hero__text">
          <span className="eyebrow eyebrow--light">Welcome back</span>
          <h1>Hi {displayName}, let’s get you hired.</h1>
          <p>Your road to the offer letter, one step at a time. Pick up where you left off or start something new.</p>
          <div className="hero__cta">
            <Link className="btn" to="/roadmaps">Start your roadmap</Link>
            <Link className="btn btn--cream" to="/interviews">Practise an interview</Link>
          </div>
        </div>
        <div className="hero__art"><Logo size={170} mono /></div>
      </section>

      <section className="section">
        <div className="section__head">
          <h2>Free for you</h2>
          <span className="badge">FREE</span>
        </div>
        <div className="grid grid--5">
          {FREE.map((f) => (
            <Link key={f.title} to={f.to} className="card card--link tile">
              <span className="tile__icon"><Icon name={f.icon} size={22} /></span>
              <h3>{f.title}</h3>
              <p className="muted">{f.text}</p>
            </Link>
          ))}
        </div>
      </section>

      {!isPro && (
        <section className="promo">
          <div>
            <span className="eyebrow eyebrow--orange">Pro · ₹499</span>
            <h2>Take the next level</h2>
            <p>Video simulation interviews, next-level AI interview, bigger job openings and mock interviews with more features.</p>
          </div>
          <Link className="btn" to="/pro">See what’s in Pro</Link>
        </section>
      )}

      <section className="section">
        <div className="section__head">
          <h2>Latest job openings</h2>
          <Link to="/jobs" className="link">View all →</Link>
        </div>
        <Async state={jobs}>
          {(list) => (
            <div className="grid">
              {list.slice(0, 4).map((j) => (
                <div key={j.id} className="card job">
                  <div>
                    <h3>{j.title}</h3>
                    <p className="muted">{j.company} · {j.location}</p>
                  </div>
                  {j.locked ? <Lock /> : <span className="chip">{j.salary || j.job_type}</span>}
                </div>
              ))}
            </div>
          )}
        </Async>
      </section>
    </>
  )
}
