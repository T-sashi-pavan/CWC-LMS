import { Link } from 'react-router-dom'
import { PageHead, SectionHead } from '../components/ui.jsx'
import SocialLinks from '../components/SocialLinks.jsx'
import { useAuth } from '../context/AuthContext.jsx'

// PLACEHOLDER copy: replace with Chaitanya's real story and numbers.
export default function About() {
  const { user } = useAuth()
  return (
    <>
      <PageHead eyebrow="About us" title="CWC Ecosystem">
        We help students and freshers turn learning into a first offer letter.
      </PageHead>

      <div className="grid grid--3">
        <article className="card"><h3>Our mission</h3><p className="muted">Make clear, honest career guidance available to every student, whatever their college or city.</p></article>
        <article className="card"><h3>What we do</h3><p className="muted">Video courses, role roadmaps, mock interviews and a community Open Mic, all in one place.</p></article>
        <article className="card"><h3>How we teach</h3><p className="muted">Practical first: build, practise out loud, get feedback, repeat.</p></article>
      </div>

      <section className="section">
        <SectionHead eyebrow="Follow along" title="Find Chaitanya online" sub="Free lessons, student wins and career advice, wherever you like to watch." />
        <SocialLinks variant="cards" />
      </section>

      {user ? (
        <section className="bigcta">
          <h2>Keep going, you are doing great.</h2>
          <p>Pick up your next lesson or explore a roadmap.</p>
          <div className="hero__cta">
            <Link className="btn btn--lg" to="/">Back to my dashboard</Link>
            <Link className="btn btn--cream btn--lg" to="/roadmaps">Browse roadmaps</Link>
          </div>
        </section>
      ) : (
        <section className="bigcta">
          <h2>Join the community.</h2>
          <p>Create a free account and start learning with us today.</p>
          <div className="hero__cta">
            <Link className="btn btn--lg" to="/login?mode=signup">Sign up free</Link>
          </div>
        </section>
      )}
    </>
  )
}
