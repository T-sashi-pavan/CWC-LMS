import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'

const ROUNDS = [
  { n: '01', name: 'Aptitude' },
  { n: '02', name: 'Reasoning' },
  { n: '03', name: 'Technical' },
  { n: '04', name: 'HR Round' },
  { n: '05', name: '1-to-1 Review' },
]
const KEY = 'cwc_sim_nudge'
const wasSeen = () => { try { return sessionStorage.getItem(KEY) === '1' } catch { return false } }
const markSeen = () => { try { sessionStorage.setItem(KEY, '1') } catch { /* ignore */ } }
const QUIET = ['/interview-simulator', '/interviews', '/login']

// Floating pulsing dot beacon on bottom-right that morphs into a flagship 5-round Interview Mock card.
export function SimulatorNudge() {
  const { pathname } = useLocation()
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (wasSeen() || QUIET.includes(pathname)) return undefined
    let collapseTimer
    const showTimer = setTimeout(() => {
      if (document.querySelector('.greet')) return
      setExpanded(true)
      // On mobile, auto-peek for 3 seconds then collapse back to the compact symbol
      if (window.innerWidth <= 768) {
        collapseTimer = setTimeout(() => {
          setExpanded(false)
          markSeen()
        }, 3000)
      }
    }, 3500)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(collapseTimer)
    }
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
          aria-label="Open Interview Mock Simulator"
          title="Interview Simulator · 5 Mock Rounds"
        >
          <span className="sim-beacon__pulse" aria-hidden="true" />
          <Icon name="bot" size={18} />
          <span className="sim-beacon__label">Mock Interviews</span>
        </button>
      ) : (
        <div className="sim-beacon__card">
          <button type="button" className="jnudge__x" onClick={collapse} aria-label="Collapse">×</button>
          <div className="sim-beacon__top">
            <span className="sim-beacon__ic"><Icon name="bot" size={20} /></span>
            <div className="sim-beacon__title">
              <span className="sim-beacon__live"><i /> 5-Round Simulator</span>
              <strong>Practise real interviews</strong>
            </div>
          </div>
          <ol className="sim-beacon__track" aria-label="Mock interview rounds">
            {ROUNDS.map((r) => (
              <li key={r.n}>
                <span>{r.n}</span>
                <small>{r.name}</small>
              </li>
            ))}
          </ol>
          <Link to="/interview-simulator" className="btn btn--sm sim-beacon__go" onClick={() => markSeen()}>
            Start Mock Interview <Icon name="arrow" size={14} />
          </Link>
        </div>
      )}
    </aside>
  )
}

export default SimulatorNudge
