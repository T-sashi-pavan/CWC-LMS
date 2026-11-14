import { Link } from 'react-router-dom'
import Logo, { Wordmark } from './Logo.jsx'
import SocialLinks from './SocialLinks.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Footer() {
  const { user } = useAuth()
  return (
    <footer className="footer footer--full">
      <div className="footer__in">
        <div className="footer__brand">
          <Link to="/" className="brand" aria-label="Career with Chaitanya home"><Logo size={40} /><Wordmark /></Link>
          <p className="muted">Roadmaps, mock interviews and guidance to help you land your first offer letter.</p>
          <SocialLinks />
        </div>
        <nav className="footer__col" aria-label="Explore">
          <strong>Explore</strong>
          <Link to="/open-mic">CWC Open Mic</Link>
          <Link to="/interview-simulator">Interview Simulator</Link>
          <Link to="/roadmaps">Roadmaps</Link>
          <Link to="/courses">Course videos</Link>
          <Link to="/testimonials">Testimonials</Link>
        </nav>
        <nav className="footer__col" aria-label="Company">
          <strong>Company</strong>
          <Link to="/about">About us</Link>
          {user ? (
            <Link to="/">My dashboard</Link>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/login?mode=signup">Sign up free</Link>
            </>
          )}
        </nav>
      </div>
      <div className="footer__copy">© {new Date().getFullYear()} CWC Ecosystem (Career with Chaitanya). All rights reserved.</div>
    </footer>
  )
}
