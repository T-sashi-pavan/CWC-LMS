import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'

const pad = (n) => String(n).padStart(2, '0')
const WIDE = 16 / 9

// Slideshow of the offline-meet photos that share the same 16:9 shape, so every photo is shown whole
// with no cropping and no side bars. `onOpen` gets the photo's index in the full list (for the lightbox).
export default function OfflineCarousel({ photos, onOpen }) {
  const slides = photos
    .map((p, idx) => ({ ...p, idx }))
    .filter((p) => Math.abs(p.w / p.h - WIDE) < 0.02)
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const go = (d) => setI((x) => (x + d + slides.length) % slides.length)

  useEffect(() => {
    if (paused || slides.length < 2) return undefined
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 4500)
    return () => clearInterval(t)
  }, [paused, slides.length])

  if (!slides.length) return null
  return (
    <div className="ocar" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="ocar__stage">
        {slides.map((p, k) => (
          <button key={p.n} className={`ocar__slide ${k === i ? 'is-on' : ''}`} onClick={() => onOpen(p.idx)} aria-hidden={k !== i} tabIndex={k === i ? 0 : -1} aria-label={`Open offline meet photo ${k + 1}`}>
            <img className="ocar__img" src={`/meetups/m${pad(p.n)}.webp`} alt="" loading={k === 0 ? 'eager' : 'lazy'} />
          </button>
        ))}
        <span className="ocar__tag"><i /> Offline meet</span>
        <button className="ocar__nav ocar__nav--prev" onClick={() => go(-1)} aria-label="Previous photo"><Icon name="arrow" size={20} className="flip" /></button>
        <button className="ocar__nav ocar__nav--next" onClick={() => go(1)} aria-label="Next photo"><Icon name="arrow" size={20} /></button>
      </div>
    </div>
  )
}
