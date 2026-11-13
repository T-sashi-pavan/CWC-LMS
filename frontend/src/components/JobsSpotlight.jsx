import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'
import { useApi } from '../lib/useApi.js'

const FALLBACK = ['Fresher openings', 'Python developer roles', 'Data analyst roles', 'Remote and hybrid jobs', 'Interview-ready? Apply now']

// Titles for the ticker/pop-up: real openings when the API answers, friendly generic lines otherwise.
function useHeadlines() {
  const { data } = useApi('/jobs/')
  const real = Array.isArray(data) ? data.filter((j) => !j.locked).slice(0, 5).map((j) => `${j.title} at ${j.company}`) : []
  return real.length >= 2 ? real : FALLBACK
}

// A slim, scrolling "news ticker" on the home pages. The whole bar is one link to the jobs page.
export default function JobsTicker() {
  const items = useHeadlines()
  const line = items.concat(items)
  return (
    <Link to="/jobs" className="jtick" aria-label="See the latest job openings">
      <span className="jtick__tag"><i className="jtick__dot" /> <Icon name="briefcase" size={15} /> Now hiring</span>
      <span className="jtick__view" aria-hidden="true">
        <span className="jtick__run">
          {line.map((t, i) => <span key={i} className="jtick__item">{t}<b>✦</b></span>)}
        </span>
      </span>
      <span className="jtick__go">View jobs <Icon name="arrow" size={14} /></span>
    </Link>
  )
}

const KEY = 'cwc_jobs_nudge'
const read = () => { try { return sessionStorage.getItem(KEY) === '1' } catch { return false } }
const write = () => { try { sessionStorage.setItem(KEY, '1') } catch { /* shows again next page load */ } }
const QUIET = ['/jobs', '/login']

// A small card that slides in at the bottom-left a few seconds after arriving (like a cookie notice, but friendly).
// It is dismissible and shows once per visit; it also stays away from the jobs and login pages.
export function JobsNudge() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const items = useHeadlines()

  useEffect(() => {
    if (read() || QUIET.includes(pathname)) return undefined
    const t = setTimeout(() => {
      if (!document.querySelector('.greet')) setOpen(true) // never on top of the greeting poster
    }, 9000)
    return () => clearTimeout(t)
  }, [pathname])

  const close = () => { setOpen(false); write() }
  if (!open || QUIET.includes(pathname)) return null
  return (
    <aside className="jnudge" role="complementary" aria-label="Job openings">
      <button className="jnudge__x" onClick={close} aria-label="Dismiss">×</button>
      <span className="jnudge__icon"><Icon name="briefcase" size={22} /></span>
      <div className="jnudge__txt">
        <strong>Fresh job openings are live</strong>
        <span>{items[0]}</span>
      </div>
      <Link to="/jobs" className="btn btn--sm" onClick={close}>See jobs <Icon name="arrow" size={14} /></Link>
    </aside>
  )
}
