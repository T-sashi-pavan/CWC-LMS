import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { SectionHead } from './ui.jsx'
import { SOCIAL } from '../data/site.js'
import { STUDENTS } from '../data/students.js'
import posts from '../data/linkedin.json'

const EMBED_W = 504     // LinkedIn's embed is designed for this width: any narrower and its text reflows and scrolls
const STAGE_H = 640     // fixed stage height on desktop, so switching posts never moves the page

// "Sai Bhavya" -> the student photo for Bhavya; "Vijay Kumar" -> Vijay (no photo yet: initial instead)
const studentFor = (name) => {
  const words = name.toLowerCase().split(/\s+/)
  return STUDENTS.find((s) => words.some((w) => w === s.name.toLowerCase().split(/\s+/)[0]))
}

function Avatar({ name, size = 40 }) {
  const s = studentFor(name)
  return s?.photo
    ? <img className="lw-av" src={s.photo} alt="" width={size} height={size} loading="lazy" style={{ width: size, height: size }} />
    : <span className="lw-av lw-av--init" style={{ width: size, height: size }} aria-hidden="true">{name.trim()[0] || 'in'}</span>
}

function useWidth(ref) {
  const [w, setW] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
    ro.observe(el)
    setW(el.clientWidth)
    return () => ro.disconnect()
  }, [ref])
  return w
}

// A showcase for the LinkedIn posts: students on the left, ONE post on a stage on the right, shown whole.
// The embed is rendered at its real 504px width and scaled to fit, so it never needs an inner scrollbar.
export default function LinkedInPosts({ title = 'Our students on LinkedIn', sub = 'Students share their wins and progress in their own posts.', seeAll = false }) {
  const [who, setWho] = useState('all')
  const [idx, setIdx] = useState(0)
  const stageRef = useRef(null)
  const stageW = useWidth(stageRef)
  const linkedin = SOCIAL.find((s) => s.key === 'linkedin')

  const people = useMemo(() => {
    const m = new Map()
    posts.forEach((p) => m.set(p.name, (m.get(p.name) || 0) + 1))
    return [...m.entries()]
  }, [])
  const list = who === 'all' ? posts : posts.filter((p) => p.name === who)
  const cur = list[Math.min(idx, list.length - 1)]

  useEffect(() => { setIdx(0) }, [who])
  useEffect(() => {
    const onKey = (e) => {
      if (!stageRef.current?.contains(document.activeElement)) return
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  if (!posts.length) return null
  const go = (d) => setIdx((i) => (i + d + list.length) % list.length)

  const wide = stageW >= 700                              // desktop: fixed-height stage; phone/tablet: height follows the post
  const pad = wide ? 28 : 14
  const h = cur.height || 541
  const scale = Math.min(1, (stageW - pad * 2) / EMBED_W, wide ? (STAGE_H - pad * 2 - 56) / h : 9)
  const boxW = Math.round(EMBED_W * scale)
  const boxH = Math.round(h * scale)

  return (
    <section className="section" id="linkedin">
      <SectionHead eyebrow="On LinkedIn" title={title} sub={sub}>
        {seeAll
          ? <Link className="link" to="/testimonials">See all testimonials →</Link>
          : <a className="link" href={linkedin.url} target="_blank" rel="noopener noreferrer">Follow on LinkedIn →</a>}
      </SectionHead>

      <div className="lw">
        <nav className="lw__rail" aria-label="Choose a student">
          <button className={`lw__who ${who === 'all' ? 'is-on' : ''}`} onClick={() => setWho('all')}>
            <span className="lw__all"><Icon name="star" size={18} /></span>
            <span className="lw__name"><strong>All students</strong><small>{posts.length} posts</small></span>
          </button>
          {people.map(([name, n]) => (
            <button key={name} className={`lw__who ${who === name ? 'is-on' : ''}`} onClick={() => setWho(name)}>
              <Avatar name={name} size={36} />
              <span className="lw__name"><strong>{name}</strong><small>{n} {n === 1 ? 'post' : 'posts'}</small></span>
            </button>
          ))}
        </nav>

        <div className="lw__stage" style={wide ? { height: STAGE_H } : undefined} ref={stageRef} tabIndex={-1}>
          <header className="lw__bar">
            <Avatar name={cur.name} size={40} />
            <span className="lw__title"><strong>{cur.name}</strong><small>Post {list.indexOf(cur) + 1} of {list.length}{who === 'all' ? ' · all students' : ''}</small></span>
            <a className="lw__open" href={cur.url} target="_blank" rel="noopener noreferrer">Open on LinkedIn <Icon name="arrow" size={14} /></a>
          </header>

          <div className="lw__canvas">
            <div className="lw__post" style={{ width: boxW, height: boxH }}>
              <iframe
                key={cur.url}
                src={cur.embed}
                title={`LinkedIn post by ${cur.name}`}
                style={{ width: EMBED_W, height: h, transform: `scale(${scale})` }}
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>

          {list.length > 1 && (
            <>
              <button className="lw__nav lw__nav--prev" onClick={() => go(-1)} aria-label="Previous post"><Icon name="arrow" size={20} className="flip" /></button>
              <button className="lw__nav lw__nav--next" onClick={() => go(1)} aria-label="Next post"><Icon name="arrow" size={20} /></button>
              <div className="lw__dots" role="tablist" aria-label="Posts">
                {list.map((p, i) => (
                  <button key={p.url} role="tab" aria-selected={p === cur} className={p === cur ? 'is-on' : ''} onClick={() => setIdx(i)} aria-label={`Post ${i + 1}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
