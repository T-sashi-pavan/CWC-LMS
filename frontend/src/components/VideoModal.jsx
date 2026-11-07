import { useEffect } from 'react'

export const thumb = (yt) => `https://i.ytimg.com/vi/${yt}/maxresdefault.jpg`

// maxresdefault is 1280x720 (sharp) but missing on some videos: fall back to hqdefault.
export function Thumb({ yt, ...rest }) {
  return (
    <img
      src={thumb(yt)}
      alt=""
      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` }}
      {...rest}
    />
  )
}

export function PlayIcon({ size = 56 }) {
  return (
    <span className="play" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 24 24" width={size * 0.4} height={size * 0.4}><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
    </span>
  )
}

export function Embed({ yt, title, autoplay = true }) {
  return (
    <iframe
      className="embed"
      src={`https://www.youtube-nocookie.com/embed/${yt}?rel=0${autoplay ? '&autoplay=1' : ''}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  )
}

export default function VideoModal({ video, onClose }) {
  useEffect(() => {
    if (!video) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [video, onClose])

  if (!video) return null
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={video.title || video.name} onClick={onClose}>
      <div className="modal__box" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close video">×</button>
        <div className="ratio"><Embed yt={video.yt} title={video.title || video.name} /></div>
      </div>
    </div>
  )
}
