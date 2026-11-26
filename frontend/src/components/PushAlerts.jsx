import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import { api } from '../lib/api.js'
import { useToast } from '../context/ToastContext.jsx'

const VAPID_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
  return outputArray
}

export default function PushAlerts() {
  const toast = useToast()
  const [supported, setSupported] = useState(false)
  const [sub, setSub] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!VAPID_KEY || typeof window === 'undefined') return
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return
    setSupported(true)
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((s) => setSub(s || null))
      .catch(() => {})
  }, [])

  if (!supported) return null

  const enable = async () => {
    setBusy(true)
    try {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') {
        toast('Please allow notifications in your browser settings to receive alerts.')
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
      toast('Push alerts turned off.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="push-bar">
      <div className="push-bar__info">
        <span className="push-bar__ic"><Icon name="sparkle" size={18} /></span>
        <div>
          <strong>{sub ? 'Job & Meet Alerts Active' : 'Get instant Job & Meet Alerts'}</strong>
          <small>{sub ? 'You will receive notifications on this device.' : 'Receive free push notifications for new openings & offline meets.'}</small>
        </div>
      </div>
      {sub ? (
        <button type="button" className="btn btn--sm btn--outline" onClick={disable} disabled={busy}>
          {busy ? 'Updating…' : 'Turn off'}
        </button>
      ) : (
        <button type="button" className="btn btn--sm" onClick={enable} disabled={busy}>
          {busy ? 'Enabling…' : 'Enable alerts'}
        </button>
      )}
    </div>
  )
}

