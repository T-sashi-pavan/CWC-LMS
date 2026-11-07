import { Link } from 'react-router-dom'
import { PageHead } from '../components/ui.jsx'

// PLACEHOLDER copy: replace with Chaitanya's real story and numbers.
export default function About() {
  return (
    <>
      <PageHead eyebrow="About us" title="Career with Chaitanya">
        We help students and freshers turn learning into a first offer letter.
      </PageHead>

      <div className="grid grid--3">
        <article className="card"><h3>Our mission</h3><p className="muted">Make clear, honest career guidance available to every student, whatever their college or city.</p></article>
        <article className="card"><h3>What we do</h3><p className="muted">Video courses, role roadmaps, mock interviews and a community Open Mic, all in one place.</p></article>
        <article className="card"><h3>How we teach</h3><p className="muted">Practical first: build, practise out loud, get feedback, repeat.</p></article>
      </div>

      <section className="land__cta">
        <h2>Join the community</h2>
        <div className="hero__cta">
          <Link className="btn" to="/login?mode=signup">Sign up free</Link>
        </div>
      </section>
    </>
  )
}
