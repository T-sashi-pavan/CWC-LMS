import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApi } from '../lib/useApi.js'
import { Async, SectionHead } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import Protected from '../components/Protected.jsx'
import { catIcon, catLabel, loginLink } from '../components/RoadmapCard.jsx'

const pct = (s) => Number((/(\d+)\s*%/.exec(s) || [])[1])

function Hero({ r, c }) {
  const meta = (c?.meta_line || r.tagline || '').split('|').map((s) => s.trim()).filter(Boolean)
  return (
    <header className={`rhero rhero--${r.category}`}>
      <Link to="/roadmaps" className="rhero__back"><Icon name="arrow" size={14} className="flip" /> All roadmaps</Link>
      <span className="eyebrow eyebrow--light">{catLabel(r.category)}</span>
      <h1>{r.title}</h1>
      <p className="rhero__sum">{c?.summary || r.summary}</p>
      {meta.length > 0 && <div className="rhero__meta">{meta.map((m) => <span key={m} className="rchip">{m}</span>)}</div>}
      <div className="rhero__stats">
        {r.phase_count > 0 && <span><strong>{r.phase_count}</strong> phases</span>}
        {c?.module_count > 0 && <span><strong>{c.module_count}</strong> modules</span>}
        {r.lab_count > 0 && <span><strong>{r.lab_count}</strong> labs</span>}
      </div>
      <span className="rhero__icon" aria-hidden="true"><Icon name={catIcon(r.category)} size={150} /></span>
    </header>
  )
}

function Overview({ c }) {
  const t = c.target_role || {}
  return (
    <section className="section" id="overview">
      <SectionHead eyebrow="Overview" title="What this roadmap is about" />
      {c.facts?.length > 0 && (
        <dl className="rfacts">
          {c.facts.map((f) => <div key={f.label}><dt>{f.label}</dt><dd>{f.text}</dd></div>)}
        </dl>
      )}
      {c.overview?.map((p, i) => <p key={i} className="rlead">{p}</p>)}
      {(t.text || t.competencies?.length > 0) && (
        <div className="rrole">
          <div>
            <span className="eyebrow">Target role</span>
            <h3>{t.title || 'The role'}</h3>
            {t.text && <p>{t.text}</p>}
          </div>
          {t.competencies?.length > 0 && (
            <ul className="rticks">{t.competencies.map((x) => <li key={x}>{x}</li>)}</ul>
          )}
        </div>
      )}
    </section>
  )
}

function Phases({ phases, full }) {
  const [open, setOpen] = useState(() => new Set(full ? [phases[0]?.n] : []))
  const toggle = (n) => setOpen((s) => { const x = new Set(s); x.has(n) ? x.delete(n) : x.add(n); return x })
  const allOpen = open.size === phases.length
  return (
    <section className="section" id="phases">
      <SectionHead eyebrow="The road" title="Phase by phase">
        {full && <button className="link" onClick={() => setOpen(allOpen ? new Set() : new Set(phases.map((p) => p.n)))}>{allOpen ? 'Collapse all' : 'Expand all'}</button>}
      </SectionHead>
      <ol className="rphases">
        {phases.map((p) => {
          const isOpen = open.has(p.n)
          const mods = full ? p.modules : (p.module_titles || []).map((t) => ({ title: t }))
          return (
            <li key={p.n} className={`rphase ${isOpen ? 'is-open' : ''}`}>
              <span className="rphase__n">{p.n}</span>
              <div className="rphase__card">
                {full ? (
                  <button className="rphase__head" onClick={() => toggle(p.n)} aria-expanded={isOpen}>
                    <span><strong>{p.title}</strong>{p.objective && <small>{p.objective}</small>}</span>
                    <Icon name="chevron" size={20} className="rphase__chev" />
                  </button>
                ) : (
                  <div className="rphase__head rphase__head--static">
                    <span><strong>{p.title}</strong>{p.objective && <small>{p.objective}</small>}</span>
                  </div>
                )}
                {!full && mods.length > 0 && (
                  <div className="rphase__mods">{mods.map((m) => <span key={m.title} className="rchip">{m.title}</span>)}</div>
                )}
                {full && isOpen && (
                  <div className="rphase__body">
                    <div className="rmods">
                      {mods.map((m) => (
                        <div key={m.title} className="rmod">
                          <h4>{m.title}</h4>
                          <ul>{m.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
                        </div>
                      ))}
                    </div>
                    {(p.lab || p.projects?.length > 0) && (
                      <div className="rlab">
                        <span className="rlab__tag">{p.projects?.length ? 'Practical projects' : 'Practical lab'}</span>
                        {p.lab && <p>{p.lab}</p>}
                        {p.projects?.length > 0 && <ul>{p.projects.map((x) => <li key={x}>{x}</li>)}</ul>}
                      </div>
                    )}
                    {p.outcome && <p className="rout"><Icon name="sparkle" size={16} /> <span><strong>Outcome</strong> {p.outcome}</span></p>}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function Extras({ c }) {
  const rows = c.assessment || []
  const bars = rows.length > 0 && rows.every((x) => !Number.isNaN(pct(x)))
  return (
    <>
      {c.tech_stack?.length > 0 && (
        <section className="section" id="tech">
          <SectionHead eyebrow="Tools" title="Technology stack" />
          <div className="rtech">
            {c.tech_stack.map((g) => (
              <div key={g.category} className="rtech__g">
                <h4>{g.category}</h4>
                <div>{g.items.map((i) => <span key={i} className="rchip rchip--tool">{i}</span>)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {c.projects?.length > 0 && (
        <section className="section" id="projects">
          <SectionHead eyebrow="Portfolio" title="Projects you’ll build" />
          <div className="rproj">
            {c.projects.map((p, i) => (
              <article key={p.title} className="rproj__c"><span>{String(i + 1).padStart(2, '0')}</span><h4>{p.title}</h4>{p.text && <p>{p.text}</p>}</article>
            ))}
          </div>
        </section>
      )}

      {(c.methodology?.length > 0 || rows.length > 0) && (
        <section className="section duo">
          {c.methodology?.length > 0 && (
            <div className="panel panel--sun">
              <div className="panel__head"><h3>How you’ll learn</h3></div>
              <ul className="rticks">{c.methodology.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </div>
          )}
          {rows.length > 0 && (
            <div className="panel">
              <div className="panel__head"><h3>How you’re assessed</h3></div>
              {bars ? (
                <ul className="rbars">
                  {rows.map((x) => { const [name] = x.split('—'); return (
                    <li key={x}><span>{name.trim()}</span><i style={{ '--w': `${pct(x)}%` }} /><b>{pct(x)}%</b></li>
                  ) })}
                </ul>
              ) : (
                <ul className="rticks">{rows.map((x, i) => <li key={i}>{x}</li>)}</ul>
              )}
            </div>
          )}
        </section>
      )}

      {c.skills?.length > 0 && (
        <section className="section" id="skills">
          <SectionHead eyebrow="Outcomes" title="Skills you’ll have" />
          <ul className="rticks rticks--cols">{c.skills.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </section>
      )}

      {c.extras?.map((e) => (
        <section className="section" key={e.title}>
          <SectionHead eyebrow="More" title={e.title} />
          {e.paras.map((p, i) => <p key={i} className="rlead">{p}</p>)}
          {e.bullets.length > 0 && <ul className="rticks rticks--cols">{e.bullets.map((x, i) => <li key={i}>{x}</li>)}</ul>}
          {e.tables.map((t, i) => (
            <div className="rtable" key={i}><table>
              <thead><tr>{t[0].map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>{t.slice(1).map((row, k) => <tr key={k}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
            </table></div>
          ))}
        </section>
      ))}

      {c.careers?.length > 0 && (
        <section className="section" id="careers">
          <SectionHead eyebrow="Careers" title="Roles this leads to" />
          <div className="rcareers">{c.careers.map((x) => <span key={x} className="rchip rchip--role">{x}</span>)}</div>
        </section>
      )}

      {c.goal && (
        <section className="bigcta rgoal">
          <span className="eyebrow eyebrow--light">The goal</span>
          <p>{c.goal}</p>
        </section>
      )}
    </>
  )
}

function Lock({ r }) {
  const pro = r.access === 'preview' && r.locked
  return (
    <div className="rlock">
      <span className="rlock__icon"><Icon name="lock" size={28} /></span>
      <h3>{pro ? 'This roadmap is part of Pro' : r.access === 'none' ? 'Log in to see your roadmap guidance' : 'Log in to unlock the full roadmap'}</h3>
      <p>
        {pro
          ? 'Upgrade to see every module, lab, tool and project.'
          : 'Every module, practical lab, tool and project is free once you have an account.'}
      </p>
      {pro
        ? <span className="chip">Coming soon</span>
        : <div className="hero__cta">
            <Link className="btn btn--lg" {...loginLink(r.slug, true)}>Sign up free</Link>
            <Link className="btn btn--outline btn--lg" {...loginLink(r.slug)}>Log in</Link>
          </div>}
    </div>
  )
}

export default function RoadmapDetail() {
  const { slug } = useParams()
  const state = useApi(`/roadmaps/${slug}/`)
  return (
    <Async state={state}>
      {(r) => {
        const c = r.content
        const full = r.access === 'full'
        return (
          <Protected className="rdetail">
            <Hero r={r} c={c} />
            {c && <Overview c={c} />}
            {c?.phases?.length > 0 && <Phases phases={c.phases} full={full} />}
            {!full && <Lock r={r} />}
            {full && <Extras c={c} />}
          </Protected>
        )
      }}
    </Async>
  )
}
