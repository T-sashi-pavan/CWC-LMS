import { useEffect, useState } from 'react'
import { SectionHead } from './ui.jsx'
import { COURSES } from '../data/homeContent.js'
import { Embed, PlayIcon, Thumb } from './VideoModal.jsx'
import { progress, useProgress } from '../lib/progress.js'

// YouTube-style layout: big player on the left, "up next" playlist on the right.
// `track` = remember what was watched (logged-in dashboard only).
export default function CourseVideos({ track = false }) {
  const p = useProgress()
  const [local, setLocal] = useState({ course: COURSES[0].id, idx: 0 })
  const [playing, setPlaying] = useState(false)

  const pos = track ? p.last : local
  const course = COURSES.find((c) => c.id === pos.course) || COURSES[0]
  const idx = Math.min(pos.idx, course.videos.length - 1)
  const cur = course.videos[idx]
  const done = (c) => new Set(p.watched[c] || [])

  const go = (c, i) => (track ? progress.select(c, i) : setLocal({ course: c, idx: i }))
  const play = (c, i) => { go(c, i); setPlaying(true); if (track) progress.watch(c, i) }

  // "Resume" on the dashboard banner asks this player to start the last lesson.
  useEffect(() => {
    if (track && p.wantPlay) { setPlaying(true); progress.watch(p.last.course, p.last.idx); progress.consumePlay() }
  }, [track, p.wantPlay, p.last])

  return (
    <section className="section" id="videos">
      <SectionHead eyebrow="Video courses" title="Learn with video courses" sub="Pick a track and watch it playlist by playlist.">
        <span className="badge">FREE</span>
      </SectionHead>
      <div className="ctabs" role="tablist" aria-label="Courses">
        {COURSES.map((c) => {
          const n = track ? done(c.id).size : 0
          return (
            <button key={c.id} role="tab" aria-selected={c.id === course.id} className={`ctab ${c.id === course.id ? 'is-on' : ''}`}
              onClick={() => { go(c.id, 0); setPlaying(false) }}>
              {c.label}
              {track && <span className="ctab__n">{n}/{c.videos.length}</span>}
            </button>
          )
        })}
      </div>
      <p className="muted cv__blurb">{course.blurb}</p>

      <div className="cv">
        <div className="cv__main">
          <div className="ratio cv__player">
            {playing ? <Embed yt={cur.yt} title={cur.title} /> : (
              <button className="vc__poster" onClick={() => play(course.id, idx)} aria-label={`Play: ${cur.title}`}>
                <Thumb yt={cur.yt} />
                <span className="vc__shade" />
                <PlayIcon size={64} />
              </button>
            )}
          </div>
          <h3 className="cv__title">{cur.title}</h3>
          <p className="muted">{course.label} · Video {idx + 1} of {course.videos.length}</p>
        </div>

        <ul className="cv__list" aria-label={`${course.label} playlist`}>
          {course.videos.map((x, k) => (
            <li key={k}>
              <button className={`cv__item ${k === idx ? 'is-on' : ''}`} onClick={() => play(course.id, k)}>
                <span className="cv__thumb">
                  <Thumb yt={x.yt} loading="lazy" />
                  {track && done(course.id).has(k) && <span className="cv__done" aria-label="Watched">✓</span>}
                </span>
                <span className="cv__meta">
                  <strong>{x.title}</strong>
                  <span className="muted">{course.label}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
