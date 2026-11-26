import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { api } from '../lib/api.js'
import { useToast } from '../context/ToastContext.jsx'

const VAPID_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY
const PEEK_KEY = 'cwc_push_peek'
const wasPeeked = () => { try { return sessionStorage.getItem(PEEK_KEY) === '1' } catch { return false } }
const markPeeked = () => { try { sessionStorage.setItem(PEEK_KEY, '1') } catch { /* ignore */ } }

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
  return outputArray
}

// Header bell icon with speech-bubble popover (auto-peeks briefly when alerts are OFF; stays quiet when ON).
export default function PushAlerts() {
  const toast = useToast()
  const wrapRef = useRef(null)
  const [supported, setSupported] = useState(false)
  const [sub, setSub] = useState(null)
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!VAPID_KEY || typeof window === 'undefined') return undefined
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return undefined
    setSupported(true)

    let showTimer
    let hideTimer
    let pollTimer
    const triggerPeek = () => {
      if (wasPeeked()) return
      // Wait until the initial Fresher/Experienced greeting modal is closed
      if (document.querySelector('.greet')) {
        pollTimer = setTimeout(triggerPeek, 800)
        return
      }
      showTimer = setTimeout(() => {
        if (document.querySelector('.greet')) {
          pollTimer = setTimeout(triggerPeek, 800)
          return
        }
        setOpen(true)
        markPeeked()
        hideTimer = setTimeout(() => setOpen(false), 5000)
      }, 1000)
    }

    navigator.serviceWorker.getRegistration()
      .then((reg) => (reg ? reg.pushManager.getSubscription() : null))
      .then((s) => {
        setSub(s || null)
        if (!s) triggerPeek()
      })
      .catch(() => triggerPeek())

    return () => {
      clearTimeout(pollTimer)
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  // Close bubble on outside click or Escape
  useEffect(() => {
    if (!open) return undefined
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!supported) return null

  const enable = async () => {
    setBusy(true)
    try {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') {
        toast('Please allow notifications in your browser settings.')
        return
      }
      const reg = await navigator.serviceWorker.ready
      const s = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_KEY),
      })
      const json = s.toJSON()
      await api('/push/subscribe/', { method: 'POST', body: JSON.stringify(json) })
      setSub(s)
      setOpen(false)
      await api('/push/test/', { method: 'POST', body: JSON.stringify({ endpoint: json.endpoint }) }).catch(() => {})
      toast('Job & Meet push alerts enabled!')
    } catch {
      toast('Could not enable push alerts right now.')
    } finally {
      setBusy(false)
    }
  }

  const disable = async () => {
    if (!sub) return
    setBusy(true)
    try {
      const endpoint = sub.endpoint
      await sub.unsubscribe()
      await api('/push/unsubscribe/', { method: 'POST', body: JSON.stringify({ endpoint }) }).catch(() => {})
      setSub(null)
      setOpen(false)
      toast('Push alerts turned off.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="push-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`push-bell ${sub ? 'is-on' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={sub ? 'Notifications active' : 'Enable notifications'}
        aria-expanded={open}
        title={sub ? 'Alerts active' : 'Enable Job & Meet alerts'}
      >
        <Icon name="bell" size={18} />
        <span className={`push-bell__dot ${sub ? 'is-on' : 'is-off'}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="push-bubble" role="dialog" aria-label="Push notifications">
          <button type="button" className="push-bubble__x" onClick={() => setOpen(false)} aria-label="Close">×</button>
          <strong>{sub ? 'Job & Meet Alerts Active' : 'Turn on Job & Meet Alerts'}</strong>
          <p>{sub ? 'You will receive instant alerts on this device.' : 'Get notified instantly when new jobs or offline meets go live.'}</p>
          {sub ? (
            <button type="button" className="btn btn--sm btn--outline push-bubble__btn" onClick={disable} disabled={busy}>
              {busy ? 'Updating…' : 'Turn off alerts'}
            </button>
          ) : (
            <button type="button" className="btn btn--sm push-bubble__btn" onClick={enable} disabled={busy}>
              {busy ? 'Enabling…' : 'Enable alerts'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
