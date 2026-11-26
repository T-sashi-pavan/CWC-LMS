import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { SectionHead } from './ui.jsx'
import { HIRED_REELS } from '../data/site.js'
import { STUDENTS } from '../data/students.js'

// Instagram's own player, loaded only when the card scrolls near the screen (it is a heavy third-party page).
// Nothing plays until the visitor presses play inside it.
function Reel({ reel, n }) {
  const ref = useRef(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { setShow(true); return undefined }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShow(true); io.disconnect() } }, { rootMargin: '300px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <article className="reel" ref={ref}>
      <span className="reel__tag"><Icon name="star" size={13} /> Hired · Student {n}</span>
      <div className="reel__frame">
        {show
          ? <iframe src={`https://www.instagram.com/${reel.kind || 'reel'}/${reel.id}/embed/`} title={`Instagram reel ${n}: a student who got hired`} loading="lazy" allowFullScreen scrolling="no" />
          : <span className="reel__wait">Loading reel…</span>}
      </div>
      <a className="reel__open" href={reel.url} target="_blank" rel="noopener noreferrer">Open on Instagram <Icon name="arrow" size={14} /></a>
    </article>
  )
}

export default function HiredStudents({ showMore = true }) {
  const faces = STUDENTS.filter((s) => s.photo).slice(0, 12)
  return (
    <section className="section" id="hired">
      <SectionHead eyebrow="Success stories" title="Our students who got hired" sub="Hear it straight from the students who turned their learning into a job." />
      <div className="hired">
        {HIRED_REELS.map((r, i) => <Reel key={r.id} reel={r} n={i + 1} />)}
      </div>

      {showMore && (
        <div className="hmore hmore--compact">
          <div className="hmore__left">
            <span className="hmore__mosaic" aria-hidden="true">
              {faces.slice(0, 8).map((s) => <img key={s.id} src={s.photo} alt={s.name} loading="lazy" />)}
            </span>
            <span className="hmore__body">
              <span className="eyebrow eyebrow--light">Our community</span>
              <strong>See more of our students</strong>
              <span className="hmore__txt">Watch their progress, read their wins and meet the whole community.</span>
            </span>
          </div>
          <div className="hmore__right">
            <span className="hmore__stats">
              <Link to="/testimonials#students" className="hmore__stat-link">Student profiles</Link>
              <Link to="/testimonials#stories" className="hmore__stat-link">Video stories</Link>
              <Link to="/testimonials#linkedin" className="hmore__stat-link">LinkedIn wins</Link>
            </span>
            <Link to="/testimonials" className="btn hmore__cta">See more students <Icon name="arrow" size={16} /></Link>
          </div>
        </div>
      )}
    </section>
  )
}
