import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { COMPANIES, SOURCES, TYPES, TYPE_LABEL } from '../data/companies.js'

const LEVEL_WORD = ['', 'Easy', 'Easy to medium', 'Medium', 'Hard', 'Very hard']
const SECTIONS = [
  { id: 'journey', label: 'Hiring journey' },
  { id: 'rounds', label: 'Rounds' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'coding', label: 'Coding patterns' },
  { id: 'stories', label: 'Experiences' },
  { id: 'prep', label: 'Prep checklist' },
]

const tone = (text = '') => {
  const t = text.toLowerCase()
  if (/(selected|offer)/.test(t) && !/not selected/.test(t)) return 'good'
  if (/(reject|not selected)/.test(t)) return 'bad'
  return 'info'
}
const levelTone = (l = '') => (l.startsWith('Easy') ? 'good' : l.startsWith('Hard') || l.includes('Hard') ? 'bad' : 'mid')

function Logo({ c, big = false }) {
  return (
    <span className={`ckl ${big ? 'ckl--big' : ''}`}>
      <img src={c.logo} alt={`${c.name} logo`} loading={big ? 'eager' : 'lazy'} />
    </span>
  )
}

function Meter({ level }) {
  return (
    <span className="ckm" role="img" aria-label={`Difficulty: ${LEVEL_WORD[level]}`}>
      {[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= level ? 'on' : ''} />)}
    </span>
  )
}

/* ------------------------------------------------------------------ all companies */
function Browse() {
  const [, setParams] = useSearchParams()
  const [type, setType] = useState('all')
  const [q, setQ] = useState('')
  const list = useMemo(() => COMPANIES.filter((x) =>
    (type === 'all' || x.type === type) && (!q.trim() || x.name.toLowerCase().includes(q.trim().toLowerCase()))), [type, q])

  return (
    <>
      <section className="ckhero">
        <span className="eyebrow eyebrow--light">Free resources</span>
        <h1>Crack the <span className="grad">Company</span></h1>
        <p>Pick a company to see how it hires: the journey, every round, the questions people are asked, coding patterns and real candidate stories.</p>
        <ul className="ckhero__facts">
          <li><Icon name="route" size={16} /> Round-by-round guides</li>
          <li><Icon name="star" size={16} /> Coding patterns</li>
          <li><Icon name="quote" size={16} /> Real experiences</li>
        </ul>
      </section>

      <div className="cktools">
        <input className="rsearch" type="search" placeholder="Search a company" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search a company" />
        <div className="ckchips" role="tablist" aria-label="Company type">
          {TYPES.map((t) => (
            <button key={t.id} role="tab" aria-selected={type === t.id} className={`ckchip ${type === t.id ? 'is-on' : ''}`} onClick={() => setType(t.id)}>{t.label}</button>
          ))}
        </div>
      </div>

      {list.length === 0 ? <div className="card empty"><p>No company matches “{q}”.</p></div> : (
        <ul className="ckgrid">
          {list.map((c) => (
            <li key={c.id}>
              <button className="ckcard" onClick={() => setParams({ c: c.id })} aria-label={`Open the ${c.name} guide`}>
                <Logo c={c} big />
                <span className="ckcard__type">{TYPE_LABEL[c.type]}</span>
                <strong className="ckcard__name">{c.name}</strong>
                <span className="ckcard__tag">{c.tagline}</span>
                <span className="ckcard__meta">
                  <span><small>Difficulty</small><Meter level={c.level} /></span>
                  <span><small>Rounds</small><b>{c.rounds.length}</b></span>
                </span>
                <span className="ckcard__go">View guide <Icon name="arrow" size={15} /></span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <section className="section">
        <div className="section__head"><h2>Where to read more</h2></div>
        <div className="ckmore">
          {SOURCES.map((r) => (
            <a key={r.url} className="card ckmore__a" href={r.url} target="_blank" rel="noopener noreferrer">
              <strong>{r.name} <Icon name="arrow" size={15} /></strong>
              <span className="muted">{r.text}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}

/* ------------------------------------------------------------------ one company */
function Faq({ f, open, onToggle }) {
  return (
    <div className={`ckfaq ${open ? 'is-open' : ''}`}>
      <button onClick={onToggle} aria-expanded={open}><span>{f.q}</span><Icon name="chevron" size={18} /></button>
      {open && <p>{f.a}</p>}
    </div>
  )
}

function Checklist({ c }) {
  const items = useMemo(() => [
    'Read the hiring journey and note every stage',
    ...c.rounds.map((r) => `${r.n}: ${r.p}`),
    'Say your resume and project story aloud without notes',
    'Attend one 1-on-1 mock interview and fix the feedback',
  ], [c])
  const key = `cwc_ck_${c.id}`
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) || [] } catch { return [] }
  })
  useEffect(() => {
    try { setDone(JSON.parse(localStorage.getItem(key)) || []) } catch { setDone([]) }
  }, [key])
  const flip = (i) => setDone((d) => {
    const n = d.includes(i) ? d.filter((x) => x !== i) : [...d, i]
    try { localStorage.setItem(key, JSON.stringify(n)) } catch { /* not saved in private mode */ }
    return n
  })
  const pct = Math.round((done.length / items.length) * 100)
  return (
    <div className="ckprep">
      <div className="ckprep__bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <i style={{ width: `${pct}%` }} /><span>{pct}% ready</span>
      </div>
      <ul>
        {items.map((t, i) => (
          <li key={t}>
            <label className={done.includes(i) ? 'is-done' : ''}>
              <input type="checkbox" checked={done.includes(i)} onChange={() => flip(i)} />
              <span className="ckprep__box" aria-hidden="true">✓</span>
              <span>{t}</span>
            </label>
          </li>
        ))}
      </ul>
      <Link className="btn btn--sm" to="/interviews">Book a mock interview <Icon name="arrow" size={15} /></Link>
    </div>
  )
}

function Detail({ c }) {
  const [, setParams] = useSearchParams()
  const [faq, setFaq] = useState(0)
  const i = COMPANIES.findIndex((x) => x.id === c.id)
  const prev = COMPANIES[(i - 1 + COMPANIES.length) % COMPANIES.length]
  const next = COMPANIES[(i + 1) % COMPANIES.length]
  useEffect(() => { window.scrollTo({ top: 0 }); setFaq(0) }, [c.id])

  return (
    <>
      <button className="ckback" onClick={() => setParams({})}><Icon name="arrow" size={16} className="flip" /> All companies</button>

      <header className="ckh">
        <Logo c={c} big />
        <div className="ckh__body">
          <span className="ckcard__type">{TYPE_LABEL[c.type]}</span>
          <h1>{c.name}</h1>
          <p>{c.tagline}</p>
        </div>
        <dl className="ckh__stats">
          <div><dt>Difficulty</dt><dd><Meter level={c.level} /><small>{LEVEL_WORD[c.level]}</small></dd></div>
          <div><dt>Rounds</dt><dd><b>{c.rounds.length}</b><small>typical</small></dd></div>
        </dl>
      </header>

      <ul className="ckglance">
        {c.glance.filter(([k]) => k !== 'Difficulty').map(([k, v]) => <li key={k}><small>{k}</small><strong>{v}</strong></li>)}
      </ul>

      <nav className="cknav" aria-label="Sections">
        {SECTIONS.map((s) => <a key={s.id} href={`#${s.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>{s.label}</a>)}
      </nav>

      <section id="journey" className="cks">
        <h2><span>01</span> Hiring journey</h2>
        <ol className="ckjourney">
          {c.process.map((s, n) => (
            <li key={s.t}>
              <span className="ckjourney__n">{n + 1}</span>
              <strong>{s.t}</strong>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
        {c.reported && (
          <div className="ckreported">
            <Icon name="quote" size={22} />
            <div>
              <strong>What candidates report</strong>
              <p>{c.reported.text}</p>
              <small>Source: {c.reported.source}. A small, self-selected group, so treat it as a hint.</small>
            </div>
          </div>
        )}
      </section>

      <section id="rounds" className="cks">
        <h2><span>02</span> Round by round</h2>
        <div className="ckrounds">
          {c.rounds.map((r, n) => (
            <article key={r.n} className="ckround">
              <span className="ckround__ghost" aria-hidden="true">{n + 1}</span>
              <span className="ckround__label">Round {n + 1}</span>
              <h3>{r.n}</h3>
              <p className="ckround__fmt">{r.f}</p>
              <h4>What they test</h4>
              <ul className="ckpills">{r.w.map((x) => <li key={x}>{x}</li>)}</ul>
              <div className="cktip"><Icon name="sparkle" size={18} /><p><strong>How to prepare</strong>{r.p}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section id="faqs" className="cks">
        <h2><span>03</span> Frequently asked questions</h2>
        <div className="ckfaqs">
          {c.faqs.map((f, n) => <Faq key={f.q} f={f} open={faq === n} onToggle={() => setFaq(faq === n ? -1 : n)} />)}
        </div>
      </section>

      <section id="coding" className="cks">
        <h2><span>04</span> Coding and question patterns</h2>
        <div className="ckpats">
          {c.patterns.map((p) => (
            <article key={p.t} className="ckpat">
              <header><h3>{p.t}</h3><span className={`cklvl cklvl--${levelTone(p.l)}`}>{p.l}</span></header>
              <ul className="ckpills ckpills--soft">{p.ex.map((x) => <li key={x}>{x}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section id="stories" className="cks">
        <h2><span>05</span> Real candidate experiences</h2>
        <p className="cks__lead">Write-ups by people who attended these interviews. They open on the original site with the full rounds and questions.</p>
        <div className="ckstories">
          {c.experiences.map((e) => (
            <a key={e.url} className="ckstory" href={e.url} target="_blank" rel="noopener noreferrer">
              <span className={`ckbadge ckbadge--${tone(e.tag)}`}>{e.tag}</span>
              <strong>{e.title}</strong>
              <span className="ckstory__go">Read story <Icon name="arrow" size={14} /></span>
            </a>
          ))}
          <a className="ckstory ckstory--hub" href={c.hub} target="_blank" rel="noopener noreferrer">
            <Icon name="quote" size={26} />
            <strong>More {c.name} experiences</strong>
            <span className="ckstory__go">Browse all <Icon name="arrow" size={14} /></span>
          </a>
        </div>
      </section>

      <section id="prep" className="cks">
        <h2><span>06</span> Your prep checklist</h2>
        <Checklist c={c} />
      </section>

      <footer className="ckpager">
        <button onClick={() => setParams({ c: prev.id })}><Icon name="arrow" size={16} className="flip" /> <Logo c={prev} /> {prev.name}</button>
        <button onClick={() => setParams({ c: next.id })}>{next.name} <Logo c={next} /> <Icon name="arrow" size={16} /></button>
      </footer>
    </>
  )
}

export default function CrackCompany() {
  const [params] = useSearchParams()
  const c = COMPANIES.find((x) => x.id === params.get('c'))
  return (
    <div className="ck">
      {c ? <Detail c={c} /> : <Browse />}
      <p className="cknote">
        Company names and logos are trademarks of their owners and are shown only to identify each company; CWC is not affiliated with them.
        These guides are written in our own words from public information and shared candidate experiences. Companies change their process often,
        so always confirm the latest rounds in the official job post or your invite mail.
      </p>
    </div>
  )
}
