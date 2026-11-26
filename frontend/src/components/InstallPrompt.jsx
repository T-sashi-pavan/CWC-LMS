import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'

const KEY = 'cwc_install_dismissed'
const wasDismissed = () => { try { return sessionStorage.getItem(KEY) === '1' } catch { return false } }
const markDismissed = () => { try { sessionStorage.setItem(KEY, '1') } catch { /* ignore */ } }

const isStandalone = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true)

const isIos = () =>
  typeof navigator !== 'undefined' &&
  /iphone|ipad|ipod/i.test(navigator.userAgent) &&
  !/crios|fxios/i.test(navigator.userAgent)

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null)
  const [iosHint, setIosHint] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isStandalone() || wasDismissed()) return undefined

    const onPrompt = (e) => {
      e.preventDefault()
      setDeferred(e)
      setVisible(true)
    }
    const onInstalled = () => {
      setVisible(false)
      setDeferred(null)
    }

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)

    let iosTimer
    if (isIos()) {
      iosTimer = setTimeout(() => setIosHint(true), 4000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      clearTimeout(iosTimer)
    }
  }, [])

  if (isStandalone() || (!visible && !iosHint)) return null

  const dismiss = () => {
    setVisible(false)
    setIosHint(false)
    markDismissed()
  }

  const install = async () => {
    if (!deferred) return
    deferred.prompt()
    await deferred.userChoice.catch(() => ({}))
    setDeferred(null)
    setVisible(false)
  }

  return (
    <aside className="install-bar" role="region" aria-label="Install app">
      <img src="/favicon-48.png" alt="" width="32" height="32" className="install-bar__ic" />
      <div className="install-bar__txt">
        <strong>Install CWC Ecosystem</strong>
        <small>
          {iosHint && !deferred
            ? 'Tap Share and choose "Add to Home Screen"'
            : 'Get instant app access from your home screen'}
        </small>
      </div>
      {deferred && (
        <button type="button" className="btn btn--sm" onClick={install}>
          Install <Icon name="arrow" size={14} />
        </button>
      )}
      <button type="button" className="install-bar__x" onClick={dismiss} aria-label="Dismiss install banner">×</button>
    </aside>
  )
}

