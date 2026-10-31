import { useEffect, useRef } from 'react'
import { turnstileSiteKey } from '../lib/supabase.js'

// Cloudflare Turnstile widget. Renders nothing when VITE_TURNSTILE_SITE_KEY is not set.
export default function Turnstile({ onToken }) {
  const box = useRef(null)

  useEffect(() => {
    if (!turnstileSiteKey) return
    let widgetId
    const render = () => {
      if (!window.turnstile || !box.current) return
      widgetId = window.turnstile.render(box.current, {
        sitekey: turnstileSiteKey,
        callback: onToken,
        'expired-callback': () => onToken(null),
      })
    }
    if (window.turnstile) render()
    else {
      const s = document.createElement('script')
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      s.async = true
      s.onload = render
      document.head.appendChild(s)
    }
    return () => {
      if (widgetId !== undefined && window.turnstile) window.turnstile.remove(widgetId)
    }
  }, [onToken])

  return turnstileSiteKey ? <div ref={box} className="turnstile" /> : null
}
