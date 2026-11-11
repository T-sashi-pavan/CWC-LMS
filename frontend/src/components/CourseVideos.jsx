import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHead } from './ui.jsx'
import Icon from './Icon.jsx'
import { Embed, PlayIcon, Thumb } from './VideoModal.jsx'
import { progress, useProgress } from '../lib/progress.js'
import { FREE_PER_COURSE, PLAYLISTS, PUBLIC_COURSES, TOTAL_HOURS, TOTAL_VIDEOS, fmt, ytThumb } from '../data/courses.js'

// YouTube-style course player: the video on the left, the whole playlist on the right.
//   track  = logged-in dashboard: remembers progress and the last lesson
//   gated  = visitor: the first FREE_PER_COURSE lessons play, the rest ask for a (free) login
export default function CourseVideos({ track = false, gated = false }) {
  const p = useProgress()
  // visitors only see a few courses; members see them all
  const list = gated ? PLAYLISTS.filter((c) => PUBLIC_COURSES.includes(c.label)) : PLAYLISTS
  const hidden = PLAYLISTS.length - list.length
  const [local, setLocal] = useState({ course: list[0].id, idx: 0 })
  const [playing, setPlaying] = useState(false)

  const pos = track ? p.last : local
  const course = list.find((c) => c.id === pos.course) || list[0]
  const idx = Math.min(Math.max(pos.idx || 0, 0), course.videos.length - 1)
  const cur = course.videos[idx]
  const watched = new Set(track ? p.watched[course.id] || [] : [])
  const unlocked = (k) => !gated || k < FREE_PER_COURSE

  const go = (c, i) => (track ? progress.select(c, i) : setLocal({ course: c, idx: i }))
  const play = (c, i) => { go(c, i); setPlaying(true); if (track) progress.watch(c, i) }
  const next = () => { const n = idx + 1; if (n < course.videos.length && unlocked(n)) play(course.id, n) }

  useEffect(() => { // "Resume" on the dashboard banner starts the last lesson
    if (track && p.wantPlay) { setPlaying(true); progress.watch(course.id, idx); progress.consumePlay() }
  }, [track, p.wantPlay]) // eslint-disable-line react-hooks/exhaustive-deps

  const lockedCount = gated ? Math.max(0, course.videos.length - FREE_PER_COURSE) : 0

  return (
    <section className="section" id="videos">
      <SectionHead
        eyebrow="Video courses"
        title="Learn with our free video courses"
        sub={gated
          ? `Try the first lessons of these courses now. Log in (it's free) to unlock ${hidden} more courses and every lesson.`
          : `${TOTAL_VIDEOS} lessons · ${TOTAL_HOURS}+ hours across ${PLAYLISTS.length} playlists, in Telugu and English.`}
      >
        <span className="badge">FREE</span>
      </SectionHead>

      <div className="ctabs" role="tablist" aria-label="Courses">
        {list.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={c.id === course.id}
            className={`ctab ${c.id === course.id ? 'is-on' : ''}`}
            onClick={() => { go(c.id, 0); setPlaying(false) }}
          >
            {c.label}
            <span className="ctab__n">{track ? `${(p.watched[c.id] || []).length}/${c.videos.length}` : c.videos.length}</span>
          </button>
        ))}
        {hidden > 0 && (
          <Link to="/login?mode=signup" className="ctab ctab--more">
            <Icon name="lock" size={14} /> +{hidden} more courses · Log in
          </Link>
        )}
      </div>

      <div className="cv cv2">
        <div className="cv__main">
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
            <span className="muted">Lesson {idx + 1} of {course.videos.length} · {fmt(cur.seconds)}</span>
            <button className="btn btn--sm btn--outline cv__next" onClick={next} disabled={idx + 1 >= course.videos.length || !unlocked(idx + 1)}>
              Next lesson <Icon name="arrow" size={15} />
            </button>
          </div>
          {course.blurb && <p className="muted cv__blurb2">{course.blurb}</p>}
        </div>

        <aside className="cvl" aria-label={`${course.label} playlist`}>
          <div className="cvl__head">
            <strong>{course.label}</strong>
            <span className="muted">{course.videos.length} lessons · {course.hours} h</span>
          </div>
          <ol className="cvl__list">
            {course.videos.map((x, k) => {
              const on = k === idx
              const body = (
                <>
                  <span className="cvl__no">{on ? <i className="eqbars"><b /><b /><b /></i> : k + 1}</span>
                  <span className="cvl__thumb">
                    <img src={ytThumb(x.id)} alt="" loading="lazy" width="320" height="180" />
                    <span className="cvl__dur">{fmt(x.seconds)}</span>
                    {watched.has(k) && <span className="cv__done" aria-label="Watched">✓</span>}
                  </span>
                  <span className="cvl__txt">
                    <strong>{x.title}</strong>
                    {!unlocked(k) && <small><Icon name="lock" size={12} /> Log in to watch, it’s free</small>}
                  </span>
                </>
              )
              return (
                <li key={x.id + k}>
                  {unlocked(k)
                    ? <button className={`cvl__item ${on ? 'is-on' : ''}`} onClick={() => play(course.id, k)} aria-current={on}>{body}</button>
                    : <Link className="cvl__item is-locked" to="/login?mode=signup">{body}</Link>}
                </li>
              )
            })}
          </ol>
          {lockedCount > 0 && (
            <Link to="/login?mode=signup" className="cvl__cta">
              <Icon name="lock" size={16} /> Log in to watch all {course.videos.length} lessons, free
            </Link>
          )}
        </aside>
      </div>
    </section>
  )
}
