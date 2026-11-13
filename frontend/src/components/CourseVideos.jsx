import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHead } from './ui.jsx'
import Icon from './Icon.jsx'
import { Embed, PlayIcon, Thumb } from './VideoModal.jsx'
import { progress, useProgress } from '../lib/progress.js'
import { FREE_PER_COURSE, PLAYLISTS, PUBLIC_COURSES, TOTAL_HOURS, TOTAL_VIDEOS, fmt, ytThumb } from '../data/courses.js'

// Course player: a course switcher, then the video on the left and its playlist on the right (same height).
//   track  = logged-in dashboard: all lessons, remembers progress and the last lesson
//   gated  = visitor: a few courses, FREE_PER_COURSE lessons each, then one "log in to see more" block
export default function CourseVideos({ track = false, gated = false }) {
  const p = useProgress()
  const list = gated ? PLAYLISTS.filter((c) => PUBLIC_COURSES.includes(c.label)) : PLAYLISTS
  const hidden = PLAYLISTS.length - list.length
  const [local, setLocal] = useState({ course: list[0].id, idx: 0 })
  const [playing, setPlaying] = useState(false)

  const pos = track ? p.last : local
  const course = list.find((c) => c.id === pos.course) || list[0]
  const visible = gated ? course.videos.slice(0, FREE_PER_COURSE) : course.videos   // what a visitor can see at all
  const idx = Math.min(Math.max(pos.idx || 0, 0), visible.length - 1)
  const cur = visible[idx]
  const more = course.videos.length - visible.length
  const watched = new Set(track ? p.watched[course.id] || [] : [])

  const go = (c, i) => (track ? progress.select(c, i) : setLocal({ course: c, idx: i }))
  const play = (c, i) => { go(c, i); setPlaying(true); if (track) progress.watch(c, i) }
  const next = () => { if (idx + 1 < visible.length) play(course.id, idx + 1) }

  useEffect(() => { // "Resume" on the dashboard banner starts the last lesson
    if (track && p.wantPlay) { setPlaying(true); progress.watch(course.id, idx); progress.consumePlay() }
  }, [track, p.wantPlay]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="section" id="videos">
      <SectionHead
        eyebrow="Video courses"
        title="Learn with our free video courses"
        sub={gated
          ? `Watch the first ${FREE_PER_COURSE} lessons of each course right now. Log in (it's free) to unlock more courses and every lesson.`
          : 'Full playlists with progress tracking, in Telugu and English.'}
      >
        <span className="badge">FREE</span>
      </SectionHead>

      <nav className="cnav" aria-label="Choose a course">
        <span className="cnav__label"><Icon name="route" size={16} /> Choose a course</span>
        <div className="cnav__list" role="tablist" style={{ '--cols': list.length + (hidden > 0 ? 1 : 0) <= 4 ? list.length + (hidden > 0 ? 1 : 0) : 3 }}>
          {list.map((c) => {
            const on = c.id === course.id
            const done = (p.watched[c.id] || []).length
            return (
              <button key={c.id} role="tab" aria-selected={on} className={`cnav__tab ${on ? 'is-on' : ''}`} onClick={() => { go(c.id, 0); setPlaying(false) }}>
                <span className="cnav__thumb"><img src={ytThumb(c.videos[0].id)} alt="" loading="lazy" width="96" height="54" /></span>
                <span className="cnav__txt">
                  <strong>{c.label}</strong>
                  <small>{track ? `${done} watched` : 'Playlist'}{c.lang ? ` · ${c.lang}` : ''}</small>
                </span>
              </button>
            )
          })}
          {hidden > 0 && (
            <Link to="/login?mode=signup" className="cnav__tab cnav__tab--more">
              <span className="cnav__lock"><Icon name="lock" size={18} /></span>
              <span className="cnav__txt"><strong>More courses</strong><small>Log in, it's free</small></span>
            </Link>
          )}
        </div>
      </nav>

      <div className="cv2">
        <div className="cv2__main">
          <div className="ratio cv__player">
            {playing ? <Embed yt={cur.id} title={cur.title} /> : (
              <button className="vc__poster" onClick={() => play(course.id, idx)} aria-label={`Play: ${cur.title}`}>
                <Thumb yt={cur.id} />
                <span className="vc__shade" />
                <PlayIcon size={64} />
              </button>
            )}
          </div>
          <h3 className="cv__title">{cur.title}</h3>
          <div className="cv__meta2">
            {course.lang && <span className="chip">{course.lang}</span>}
            <span className="muted">Lesson {idx + 1} · {fmt(cur.seconds)}</span>
            <button className="btn btn--sm btn--outline cv__next" onClick={next} disabled={idx + 1 >= visible.length}>
              Next lesson <Icon name="arrow" size={15} />
            </button>
          </div>
          {course.blurb && <p className="muted cv__blurb2">{course.blurb}</p>}
        </div>

        <div className="cv2__side">
          <aside className={`cvl ${gated ? 'cvl--short' : ''}`} aria-label={`${course.label} playlist`}>
            <div className="cvl__head">
              <strong>{course.label}</strong>
              <span className="muted">Course playlist</span>
            </div>
            <ol className="cvl__list">
              {visible.map((x, k) => {
                const on = k === idx
                return (
                  <li key={x.id + k}>
                    <button className={`cvl__item ${on ? 'is-on' : ''}`} onClick={() => play(course.id, k)} aria-current={on}>
                      <span className="cvl__no">{on ? <i className="eqbars"><b /><b /><b /></i> : k + 1}</span>
                      <span className="cvl__thumb">
                        <img src={ytThumb(x.id)} alt="" loading="lazy" width="320" height="180" />
                        <span className="cvl__dur">{fmt(x.seconds)}</span>
                        {watched.has(k) && <span className="cv__done" aria-label="Watched">✓</span>}
                      </span>
                      <span className="cvl__txt"><strong>{x.title}</strong></span>
                    </button>
                  </li>
                )
              })}
            </ol>
            {more > 0 && (
              <Link to="/login?mode=signup" className="cvl__more">
                <span className="cvl__morelock"><Icon name="lock" size={20} /></span>
                <span className="cvl__moretxt">
                  <strong>See {more} more {more === 1 ? 'lesson' : 'lessons'}</strong>
                  <small>Log in, it's free, to watch the whole {course.label} course.</small>
                </span>
                <span className="btn btn--sm">Log in <Icon name="arrow" size={15} /></span>
              </Link>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
