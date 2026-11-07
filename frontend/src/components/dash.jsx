import Icon from './Icon.jsx'
import { COURSES } from '../data/homeContent.js'
import { progress } from '../lib/progress.js'

export function Resume({ p }) {
  const course = COURSES.find((c) => c.id === p.last.course) || COURSES[0]
  const idx = Math.min(p.last.idx, course.videos.length - 1)
  const done = (p.watched[course.id] || []).length
  const pct = Math.round((done / course.videos.length) * 100)
  const started = Object.keys(p.watched).length > 0
  return (
    <div className="resume">
      <h1>{started ? 'Start from where you left off' : 'Start your first lesson'}</h1>
      <p className="resume__meta">
        <strong>{course.label}</strong>
        <span>Lesson {idx + 1}: {course.videos[idx].title}</span>
      </p>
      <span className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${pct}%` }} /></span>
      <span className="resume__pct">{pct}% of {course.label} done</span>
      <div className="hero__cta">
        <a className="btn" href="#videos" onClick={() => progress.resume()}>{started ? 'Resume' : 'Start'} <Icon name="arrow" size={16} /></a>
        <a className="btn btn--outline" href="#journey">See my journey</a>
      </div>
    </div>
  )
}

export function StatTiles({ s }) {
  const items = [
    { label: 'Day streak', value: s.streak, icon: 'sparkle' },
    { label: 'Lessons watched', value: s.lessons, icon: 'route' },
    { label: 'Tracks started', value: s.tracks, icon: 'star' },
    { label: 'Badges earned', value: `${s.earned}/${s.badges.length}`, icon: 'mic' },
  ]
  return (
    <div className="stats">
      {items.map((i) => (
        <div key={i.label} className="stat">
          <span className="stat__icon"><Icon name={i.icon} size={18} /></span>
          <strong>{i.value}</strong>
          <span className="muted">{i.label}</span>
        </div>
      ))}
    </div>
  )
}

export function ActivityChart({ s }) {
  const W = 300; const H = 130; const padX = 14
  const max = Math.max(3, ...s.week.map((d) => d.n))
  const pts = s.week.map((d, i) => [padX + (i * (W - padX * 2)) / 6, H - 26 - (d.n / max) * (H - 56)])
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${line} L${pts[6][0]} ${H - 26} L${pts[0][0]} ${H - 26} Z`
  const total = s.week.reduce((a, d) => a + d.n, 0)
  return (
    <div className="panel panel--sun">
      <div className="panel__head"><h3>This week</h3><span className="muted">{total} lesson{total === 1 ? '' : 's'}</span></div>
      <svg className="area" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Lessons watched in the last 7 days">
        <defs>
          <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#C85A12" stopOpacity=".55" /><stop offset="1" stopColor="#E8A03A" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => <line key={i} x1="0" x2={W} y1={20 + i * 28} y2={20 + i * 28} className="area__grid" />)}
        <path d={area} fill="url(#areaFill)" />
        <path d={line} className="area__line" />
        {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={s.week[i].today ? 5 : 3} className={s.week[i].today ? 'area__dot is-today' : 'area__dot'} />)}
        {s.week.map((d, i) => <text key={i} x={pts[i][0]} y={H - 6} textAnchor="middle" className={d.today ? 'area__lbl is-today' : 'area__lbl'}>{d.label}</text>)}
      </svg>
    </div>
  )
}

export function Badges({ s }) {
  return (
    <div className="panel panel--sun">
      <div className="panel__head"><h3>Badges</h3><span className="muted">{s.earned} earned</span></div>
      <ul className="badges">
        {s.badges.map((b) => (
          <li key={b.id} className={b.got ? 'is-got' : ''}>
            <span className="medal"><Icon name={b.got ? b.icon : 'lock'} size={22} /></span>
            <strong>{b.title}</strong>
            <small>{b.hint}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}
