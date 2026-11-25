import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'

const ROUNDS = ['Aptitude', 'Reasoning', 'Technical', 'HR', '1-to-1 Review']
const KEY = 'cwc_sim_nudge'
const wasSeen = () => { try { return sessionStorage.getItem(KEY) === '1' } catch { return false } }
const markSeen = () => { try { sessionStorage.setItem(KEY, '1') } catch { /* ignore */ } }
const QUIET = ['/interview-simulator', '/interviews', '/login']

// Floating pulsing dot on bottom-right that expands into the Interview Mock Simulator card on hover/click.
export function SimulatorNudge() {
  const { pathname } = useLocation()
  const [expanded, setExpanded] = useState(false)

  // Auto-peek once after 5s if not previously collapsed, then stay as a glowing dot when collapsed
  useEffect(() => {
    if (wasSeen() || QUIET.includes(pathname)) return undefined
    const t = setTimeout(() => {
      if (!document.querySelector('.greet')) setExpanded(true)
    }, 5000)
    return () => clearTimeout(t)
  }, [pathname])

  if (QUIET.includes(pathname)) return null

  const collapse = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setExpanded(false)
    markSeen()
  }

  return (
    <aside
      className={`sim-beacon ${expanded ? 'is-open' : ''}`}
      role="complementary"
      aria-label="Interview Simulator"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => { if (wasSeen()) setExpanded(false) }}
    >
      {!expanded ? (
        <button
          type="button"
          className="sim-beacon__dot"
          onClick={() => setExpanded(true)}
          aria-label="Open Interview Mock Simulator preview"
          title="Interview Simulator · 5 Mock Rounds"
        >
          <span className="sim-beacon__pulse" aria-hidden="true" />
          <Icon name="bot" size={20} />
          <span className="sim-beacon__label">Mocks</span>
        </button>
      ) : (
        <div className="sim-beacon__card">
          <button type="button" className="jnudge__x" onClick={collapse} aria-label="Collapse">×</button>
          <div className="sim-beacon__head">
            <span className="sim-beacon__ic"><Icon name="bot" size={20} /></span>
            <div>
              <strong>Interview Simulator</strong>
              <small>5 realistic mock rounds</small>
            </div>
          </div>
          <div className="sim-beacon__chips">
            {ROUNDS.map((r) => <span key={r}>{r}</span>)}
          </div>
          <Link to="/interview-simulator" className="btn btn--sm sim-beacon__go" onClick={() => markSeen()}>
            Try mock interview <Icon name="arrow" size={14} />
          </Link>
        </div>
      )}
    </aside>
  )
}

export default SimulatorNudge
