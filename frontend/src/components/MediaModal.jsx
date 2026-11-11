import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'

const clock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

// Immersive viewer for student stories, meetup recordings and photos.
//   item: { video | image, poster, title, eyebrow, avatar, chips[], text[], quote, tabs[], rail[], counter, thumbs[], landscape }
// Stories play inside a phone-style frame (progress bar, tap to pause, mute); landscape recordings get a wide frame.
// Esc closes, arrow keys move between items, the blurred poster fills the backdrop.
export default function MediaModal({ item, onClose, onPrev, onNext }) {
  const vref = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [t, setT] = useState({ now: 0, dur: 0 })
  const [land, setLand] = useState(false)
  const [flash, setFlash] = useState(null) // brief play/pause icon

  useEffect(() => { setLand(Boolean(item?.landscape)); setT({ now: 0, dur: 0 }); setPlaying(false) }, [item?.video, item?.landscape])

  useEffect(() => {
    if (!item) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && onPrev) onPrev()
      else if (e.key === 'ArrowRight' && onNext) onNext()
      else if (e.key === ' ' && item.video && document.activeElement?.tagName !== 'BUTTON') { e.preventDefault(); toggle() }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = useCallback(() => {
    const v = vref.current
    if (!v) return
    if (v.paused) { v.play().catch(() => {}); setFlash('play') } else { v.pause(); setFlash('pause') }
    setTimeout(() => setFlash(null), 550)
  }, [])
  const seek = (e) => {
    const v = vref.current
    if (!v || !t.dur) return
    const r = e.currentTarget.getBoundingClientRect()
    v.currentTime = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * t.dur
  }
  const fullscreen = () => { const el = vref.current; (el?.requestFullscreen || el?.webkitEnterFullscreen)?.call(el) }

  if (!item) return null
  const bg = item.poster || item.image
  const hasSide = Boolean(item.text || item.rail?.length)

  return (
    <div className="mv" role="dialog" aria-modal="true" aria-label={item.title || 'Viewer'} onClick={onClose}>
      {bg && <div className="mv__bg" style={{ backgroundImage: `url(${bg})` }} />}
      <button className="mv__close" onClick={onClose} aria-label="Close"><span>×</span></button>

      <div className={`mv__box ${hasSide ? 'has-side' : ''} ${land ? 'is-land' : ''} ${item.image ? 'is-photo' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="mv__main">
          <div className="mv__stage">
            {item.video && (
              <>
                <video
                  key={item.video}
                  ref={vref}
                  className="mv__video"
                  src={item.video}
                  poster={item.poster}
                  autoPlay
                  playsInline
                  muted={muted}
                  onClick={toggle}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onEnded={() => (onNext ? onNext() : setPlaying(false))}
                  onTimeUpdate={(e) => setT({ now: e.currentTarget.currentTime, dur: e.currentTarget.duration || 0 })}
                  onLoadedMetadata={(e) => setLand(e.currentTarget.videoWidth > e.currentTarget.videoHeight)}
                />
                <div className="mv__top">
                  <div className="mv__prog" onClick={seek} role="slider" aria-label="Seek" aria-valuemin={0} aria-valuemax={Math.round(t.dur)} aria-valuenow={Math.round(t.now)}>
                    <i style={{ width: `${t.dur ? (t.now / t.dur) * 100 : 0}%` }} />
                  </div>
                  <div className="mv__who">
                    {item.avatar && <img src={item.avatar} alt="" width="36" height="36" />}
                    <span><strong>{item.title}</strong>{item.eyebrow && <small>{item.eyebrow}</small>}</span>
                  </div>
                </div>
                {flash && <span className="mv__flash" key={flash}><Icon name={flash === 'play' ? 'arrow' : 'sparkle'} size={30} /></span>}
                {!playing && !flash && <button className="mv__bigplay" onClick={toggle} aria-label="Play"><svg viewBox="0 0 24 24" width="30" height="30"><path d="M8 5v14l11-7z" fill="currentColor" /></svg></button>}
                <div className="mv__bar">
                  <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
                    {playing
                      ? <svg viewBox="0 0 24 24" width="20" height="20"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" /></svg>
                      : <svg viewBox="0 0 24 24" width="20" height="20"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>}
                  </button>
                  <span className="mv__time">{clock(t.now)} / {clock(t.dur)}</span>
                  <button onClick={() => setMuted((m) => !m)} aria-label={muted ? 'Unmute' : 'Mute'} className="mv__mute">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" />{muted ? <path d="M17 9l5 6M22 9l-5 6" /> : <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" />}
                    </svg>
                  </button>
                  <button onClick={fullscreen} aria-label="Full screen">
                    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
                  </button>
                </div>
              </>
            )}
            {item.image && <img className="mv__img" src={item.image} alt={item.title || ''} />}
            {onPrev && <button className="mv__nav mv__nav--prev" onClick={onPrev} aria-label="Previous"><Icon name="arrow" size={20} className="flip" /></button>}
            {onNext && <button className="mv__nav mv__nav--next" onClick={onNext} aria-label="Next"><Icon name="arrow" size={20} /></button>}
          </div>
          {item.thumbs?.length > 0 && (
            <div className="mv__thumbs" role="tablist" aria-label="Photos">
              <span className="mv__count">{item.counter}</span>
              {item.thumbs.map((th) => (
                <button key={th.src} role="tab" aria-selected={th.on} className={th.on ? 'is-on' : ''} onClick={th.onClick} aria-label={th.label}>
                  <img src={th.src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {hasSide && (
          <aside className="mv__side">
            {item.counter && !item.thumbs && <span className="mv__count">{item.counter}</span>}
            <div className="mv__head">
              {item.avatar && <img src={item.avatar} alt="" width="54" height="54" />}
              <div>
                {item.eyebrow && <span className="eyebrow">{item.eyebrow}</span>}
                <h3>{item.title}</h3>
              </div>
            </div>
            {item.chips?.length > 0 && <div className="mv__chips">{item.chips.map((c) => <span key={c} className="rchip">{c}</span>)}</div>}
            {item.tabs?.length > 1 && (
              <div className="mv__tabs" role="tablist" aria-label="Versions">
                {item.tabs.map((x) => (
                  <button key={x.label} role="tab" aria-selected={x.on} className={x.on ? 'is-on' : ''} onClick={x.onClick}>{x.label}</button>
                ))}
              </div>
            )}
            {item.text?.map((p, i) => <p key={i} className={i === 0 ? 'mv__lead' : ''}>{p}</p>)}
            {item.quote && <blockquote className="mv__quote"><Icon name="quote" size={22} />{item.quote}</blockquote>}
            {item.rail?.length > 0 && (
              <div className="mv__rail">
                <h4>More stories</h4>
                <div>
                  {item.rail.map((r) => (
                    <button key={r.key} className="mv__rcard" onClick={r.onClick} aria-label={`Watch ${r.title}`}>
                      <img src={r.poster} alt="" loading="lazy" />
                      <span>{r.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  )
}
