import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { SectionHead } from './ui.jsx'
import VideoModal, { PlayIcon, Thumb } from './VideoModal.jsx'
import { CARDS, COURSES, LINKEDIN_VIDEOS, STUDENT_VIDEOS } from '../data/homeContent.js'

const SIGNUP = '/login?mode=signup'

const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

// Illustrated tile art for the three product cards (pure CSS/SVG, no image files).
const ART = [
  () => (
    <span className="art art--mic">
      <span className="art__card"><Icon name="mic" size={58} /></span>
      <span className="eq" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></span>
    </span>
  ),
  () => (
    <span className="art art--sim">
      <span className="art__card"><Icon name="bot" size={58} /></span>
      <span className="rounds5" aria-hidden="true"><b>1</b><b>2</b><b>3</b><b>4</b><b>5</b></span>
    </span>
  ),
  () => (
    <span className="art art--road">
      <svg viewBox="0 0 220 120" aria-hidden="true">
        <path className="art__path" d="M10 100 C60 100 40 30 100 30 S150 95 210 20" />
        <circle cx="10" cy="100" r="7" /><circle cx="100" cy="30" r="7" /><circle cx="210" cy="20" r="9" className="art__goal" />
      </svg>
      <span className="art__card"><Icon name="route" size={50} /></span>
    </span>
  ),
]

// Three big product cards. `compact` is the slimmer logged-in version.
export function FeatureCards({
  compact = false,
  eyebrow = 'What you get',
  title = 'Three ways to get job-ready',
  sub = 'Practise speaking, rehearse interviews and follow a plan.',
}) {
  return (
    <section className="section">
      {!compact && <SectionHead eyebrow={eyebrow} title={title} sub={sub} />}
      <div className={`fcards ${compact ? 'fcards--compact' : ''}`}>
        {CARDS.map((c, i) => {
          const Art = ART[i]
          return (
            <Link key={c.to} to={c.to} className={`fcard fcard--${i}`} onMouseMove={spot}>
              <Art />
              <span className="fcard__bar">
                <span className="fcard__txt"><strong>{c.title}</strong><small>{c.text}</small></span>
                <span className="fcard__arrow"><Icon name="arrow" size={18} /></span>
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export function StudentVideos({ limit = STUDENT_VIDEOS.length, title = 'Hear it from our students', sub = 'Real feedback from people who followed the plan.' }) {
  const [open, setOpen] = useState(null)
  return (
    <section className="section" id="testimonials">
      <SectionHead eyebrow="Testimonials" title={title} sub={sub} />
      <div className="vgrid">
        {STUDENT_VIDEOS.slice(0, limit).map((s, k) => (
          <button key={k} className="vcard" onClick={() => setOpen(s)} aria-label={`Play feedback from ${s.name}`}>
            <span className="vcard__img">
              <AutoPreview v={{ ...s, start: 30 + k * 90 }} />
              <span className="vcard__expand"><PlayIcon size={34} /></span>
            </span>
            <span className="vcard__meta"><strong>{s.name}</strong><span className="muted">{s.role}</span></span>
          </button>
        ))}
      </div>
      <VideoModal video={open} onClose={() => setOpen(null)} />
    </section>
  )
}

// Muted, looping preview that only plays while the card is on screen.
function AutoPreview({ v }) {
  const ref = useRef(null)
  const [live, setLive] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { setLive(true); return undefined }
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const play = live && !reduced
  return (
    <span className="lipv ratio" ref={ref}>
      {v.yt && <Thumb yt={v.yt} loading="lazy" />}
      {play && v.mp4 && <video className={ready ? 'is-on' : ''} src={v.mp4} autoPlay muted loop playsInline preload="metadata" onPlaying={() => setReady(true)} />}
      {play && !v.mp4 && v.yt && (
        <iframe
          className={`embed ${ready ? 'is-on' : ''}`}
          onLoad={() => setTimeout(() => setReady(true), 1200)}
          title={`Preview: ${v.name}`}
          tabIndex={-1}
          allow="autoplay; encrypted-media"
          src={`https://www.youtube-nocookie.com/embed/${v.yt}?autoplay=1&mute=1&controls=0&loop=1&playlist=${v.yt}&start=${v.start || 0}&modestbranding=1&playsinline=1&rel=0&disablekb=1`}
        />
      )}
      <span className="lipv__live"><i /> {play ? 'Preview' : 'Paused'}</span>
    </span>
  )
}

export function LinkedInVideos() {
  return (
    <section className="section" id="linkedin">
      <SectionHead eyebrow="On LinkedIn" title="Students share their wins" sub="Placement stories, posted by the students themselves." />
      <div className="ligrid">
        {LINKEDIN_VIDEOS.map((l, k) => (
          <article key={k} className="licard">
            <header className="licard__head">
              <span className="li__badge">in</span>
              <span className="licard__who"><strong>{l.name}</strong><small>{l.role}</small></span>
            </header>
            <p className="licard__text">{l.text}</p>
            <div className="licard__media">
              <AutoPreview v={l} />
              <a className="licard__overlay" href={l.url} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${l.name}'s post on LinkedIn`} />
            </div>
            <a className="licard__foot" href={l.url} target="_blank" rel="noopener noreferrer">
              <PlayIcon size={26} /> Watch on LinkedIn <Icon name="arrow" size={15} />
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

// Logged-out course catalogue: browse the tracks, sign up to watch.
export function CourseTeaser() {
  return (
    <section className="section">
      <SectionHead eyebrow="Free video courses" title="Pick a track, start learning" sub="Every lesson is free once you create an account.">
        <Link className="btn btn--sm" to={SIGNUP}>Unlock all courses</Link>
      </SectionHead>
      <div className="tracks">
        {COURSES.map((c) => (
          <Link key={c.id} to={SIGNUP} className="track">
            <span className="track__img ratio">
              <Thumb yt={c.videos[0].yt} loading="lazy" />
              <span className="track__lock"><Icon name="lock" size={16} /> Free with account</span>
            </span>
            <span className="track__bar">
              <span className="track__txt"><strong>{c.label}</strong><small>{c.videos.length} lessons</small></span>
              <span className="fcard__arrow"><Icon name="arrow" size={18} /></span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
