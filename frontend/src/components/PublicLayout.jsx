import { Link, NavLink } from 'react-router-dom'
import Logo, { Wordmark } from './Logo.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import Footer from './Footer.jsx'
import useReveal from './useReveal.js'
import { useAuth } from '../context/AuthContext.jsx'
import AppLayout from './AppLayout.jsx'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/open-mic', label: 'Open Mic' },
  { to: '/interview-simulator', label: 'Interview Simulator' },
  { to: '/roadmaps', label: 'Roadmaps' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/about', label: 'About us' },
]

// Header + footer for logged-out visitors.
export function PublicLayout({ children }) {
  useReveal()
  return (
    <div className="shell land">
      <header className="topbar">
        <div className="topbar__in">
          <Link to="/" className="brand" aria-label="Career with Chaitanya home">
            <Logo size={46} />
            <Wordmark />
          </Link>
          <nav className="tabs land__nav" aria-label="Main">
            {NAV.map((t) => (
              <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => `tab ${isActive ? 'is-active' : ''}`}>
                {t.label}
              </NavLink>
            ))}
          </nav>
          <div className="user">
            <ThemeToggle />
            <Link to="/login" className="btn btn--ghost btn--sm">Log in</Link>
            <Link to="/login?mode=signup" className="btn btn--sm land__signup">Sign up free</Link>
          </div>
        </div>
      </header>
      <main className="land__main">{children}</main>
      <Footer />
    </div>
  )
}

// Pages anyone can open: use the dashboard shell when logged in, the public one otherwise.
export default function SiteLayout({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="splash">Loading…</div>
  return user ? <AppLayout>{children}</AppLayout> : <PublicLayout>{children}</PublicLayout>
}
