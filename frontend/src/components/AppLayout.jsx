import { NavLink, Outlet } from 'react-router-dom'
import Logo, { Wordmark } from './Logo.jsx'
import Icon from './Icon.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import ProfileMenu from './ProfileMenu.jsx'
import Footer from './Footer.jsx'
import NavDropdown from './NavDropdown.jsx'
import useReveal from './useReveal.js'
import { useAuth } from '../context/AuthContext.jsx'

const TABS = [
  { to: '/', label: 'Home', end: true },
  { dropdown: true },
  { to: '/course-tracks', label: 'Courses' },
  { to: '/interviews', label: 'Interviews' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/about', label: 'About us' },
  { to: '/pro', label: 'Pro', pro: true },
]

export default function AppLayout({ children }) {
  const { demo } = useAuth()
  useReveal()

  return (
    <div className="shell">
      {demo && (
        <div className="demo-bar">Demo mode: Supabase keys not set, so any login works. Nothing is saved.</div>
      )}
      <header className="topbar">
        <div className="topbar__in">
          <NavLink to="/" className="brand" aria-label="Career with Chaitanya home">
            <Logo size={46} />
            <Wordmark />
          </NavLink>

          <nav className="tabs" aria-label="Main">
            {TABS.map((t) => (t.dropdown ? <NavDropdown key="free" /> : (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={({ isActive }) => `tab ${t.pro ? 'tab--pro' : ''} ${isActive ? 'is-active' : ''}`}
              >
                {t.pro && <Icon name="sparkle" size={14} />}
                {t.label}
              </NavLink>
            )))}
          </nav>

          <div className="user">
            <ThemeToggle />
            <ProfileMenu />
          </div>
        </div>
      </header>

      <main className={`main`}>
        {children ?? <Outlet />}
      </main>

      <Footer />
    </div>
  )
}
