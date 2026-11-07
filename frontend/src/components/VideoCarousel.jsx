import { useState } from 'react'
import { CAROUSEL } from '../data/homeContent.js'
import { Embed, PlayIcon, Thumb } from './VideoModal.jsx'

// Featured player (about 2/3 width) with a slide list beside it. The active slide's bar fills up and
// moves on to the next one when it ends. Hovering or playing pauses it.
export default function VideoCarousel() {
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const n = CAROUSEL.length
  const go = (k) => { setPlaying(false); setI((k + n) % n) }
  const s = CAROUSEL[i]
  const hold = paused || playing ? 'paused' : 'running'

  return (
    <section className="section" aria-roledescription="carousel" aria-label="Featured videos"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="vcx">
        <div className="vcx__main">
          <div className="vc__stage ratio">
            {playing ? <Embed yt={s.yt} title={s.title} /> : (
              <button className="vc__poster" onClick={() => setPlaying(true)} aria-label={`Play: ${s.title}`}>
                <Thumb yt={s.yt} />
                <span className="vc__shade" />
                <PlayIcon size={64} />
                <span className="vc__cap">
                  <span className="chip vc__tag">{s.tag}</span>
                  <strong>{s.title}</strong>
                </span>
              </button>
            )}
          </div>
          <button className="vc__nav vc__nav--prev" onClick={() => go(i - 1)} aria-label="Previous slide">‹</button>
          <button className="vc__nav vc__nav--next" onClick={() => go(i + 1)} aria-label="Next slide">›</button>
        </div>

        <ul className="vcx__list" aria-label="Featured slides">
          {CAROUSEL.map((c, k) => (
            <li key={k}>
              <button className={`vcx__item ${k === i ? 'is-on' : ''}`} onClick={() => go(k)} aria-current={k === i}>
                <span className="vcx__thumb"><Thumb yt={c.yt} loading="lazy" /></span>
                <span className="vcx__txt">
                  <small>{c.tag}</small>
                  <strong>{c.title}</strong>
                </span>
                {k === i && (
                  <span key={`${i}-${playing}`} className="vcx__bar" style={{ animationPlayState: hold }} onAnimationEnd={() => go(i + 1)} />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
