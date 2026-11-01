import { NavLink, Outlet } from 'react-router-dom'
import Logo, { Wordmark } from './Logo.jsx'
import Icon from './Icon.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import ProfileMenu from './ProfileMenu.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const TABS = [
  { to: '/', label: 'Home', end: true },
  { to: '/roadmaps', label: 'Roadmaps' },
  { to: '/interviews', label: 'Interviews' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/pro', label: 'Pro', pro: true },
]

export default function AppLayout({ children }) {
  const { demo } = useAuth()

  return (
    <div className="shell">
      {demo && (
        <div className="demo-bar">Demo mode: Supabase keys not set, so any login works. Nothing is saved.</div>
      )}
      <header className="topbar">
        <div className="topbar__in">
          <NavLink to="/" className="brand" aria-label="Career with Chaitanya home">
            <Logo size={34} />
            <Wordmark />
          </NavLink>

          <nav className="tabs" aria-label="Main">
            {TABS.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={({ isActive }) => `tab ${t.pro ? 'tab--pro' : ''} ${isActive ? 'is-active' : ''}`}
              >
                {t.pro && <Icon name="sparkle" size={14} />}
                {t.label}
              </NavLink>
            ))}
          </nav>

          <div className="user">
            <ThemeToggle />
            <ProfileMenu />
          </div>
        </div>
      </header>

      <main className="main">
        {children ?? <Outlet />}
      </main>

      <footer className="footer">© {new Date().getFullYear()} Career with Chaitanya</footer>
    </div>
  )
}
