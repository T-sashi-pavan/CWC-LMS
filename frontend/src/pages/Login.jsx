import { useCallback, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Logo, { Wordmark } from '../components/Logo.jsx'
import { useToast } from '../context/ToastContext.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'
import Icon from '../components/Icon.jsx'
import Turnstile from '../components/Turnstile.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { turnstileSiteKey } from '../lib/supabase.js'

export default function Login() {
  const { user, loading, signIn, signUp, signInGoogle, demo } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const dest = location.state?.from?.pathname || '/'

  const [mode, setMode] = useState('login') // login | signup
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [captcha, setCaptcha] = useState(null)
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const setError = (m) => m && toast(m, { type: 'error', title: 'Login failed' })
  const setNotice = (m) => m && toast(m, { type: 'success' })
  const onToken = useCallback((t) => setCaptcha(t), [])

  if (!loading && user) return <Navigate to={dest} replace />

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    if (turnstileSiteKey && !captcha) return setError('Please complete the human check.')
    setBusy(true)
    try {
      if (mode === 'login') {
        await signIn(form.email, form.password, captcha)
        navigate(dest, { replace: true })
      } else {
        const res = await signUp(form.email, form.password, form.name, captcha)
        if (res?.needsConfirmation) setNotice('Check your email to confirm your account, then log in.')
        else navigate(dest, { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const isLogin = mode === 'login'

  return (
    <div className="auth">
      <ThemeToggle floating />
      {/* LEFT: story panel, logo assembles on load */}
      <aside className="auth__story">
        <div className="auth__logo">
          <Logo size={220} animate />
        </div>
        <div className="auth__wordmark"><Wordmark /></div>
        <h2 className="auth__headline">Your next role starts here</h2>
        <p className="auth__sub">
          Roadmaps, mock interviews, AI interview and job openings, guided by Chaitanya.
        </p>
        <ul className="auth__pills" aria-label="What you get">
          <li>Free roadmaps</li>
          <li>Mock interviews</li>
          <li>AI interview</li>
          <li>Job openings</li>
        </ul>
      </aside>

      {/* RIGHT: login form */}
      <main className="auth__form">
        <form className="auth__card" onSubmit={submit} noValidate>
          <div className="auth__mobilelogo"><Logo size={72} /></div>
          <h1>{isLogin ? 'Welcome back' : 'Create your free account'}</h1>
          <p className="muted">
            {isLogin ? 'Log in to continue your journey.' : 'Start free. Upgrade to Pro any time.'}
          </p>

          {demo && <p className="auth__demo">Demo mode: Supabase keys not set. Any email and password will work.</p>}

          {!isLogin && (
            <label className="field">
              <span>Full name</span>
              <input value={form.name} onChange={set('name')} autoComplete="name" placeholder="Your name" required />
            </label>
          )}
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              autoComplete="email"
              placeholder="you@email.com"
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <div className="pw">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                placeholder="Password"
                minLength={6}
                required
              />
              <button
                type="button"
                className="pw__toggle"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                aria-pressed={showPw}
              >
                <Icon name={showPw ? 'eyeOff' : 'eye'} size={20} />
              </button>
            </div>
          </label>

          <Turnstile onToken={onToken} />

          <button className="btn btn--block" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : isLogin ? 'Login' : 'Create account'}
          </button>

          <div className="divider"><span>or</span></div>

          <button className="btn btn--outline btn--block" type="button" onClick={() => signInGoogle().catch((e) => setError(e.message))}>
            <GoogleIcon /> Continue with Google
          </button>

          <p className="auth__switch">
            {isLogin ? 'New here? ' : 'Already have an account? '}
            <button type="button" className="link" onClick={() => { setMode(isLogin ? 'signup' : 'login'); setError(''); setNotice('') }}>
              {isLogin ? 'Create a free account' : 'Log in'}
            </button>
          </p>
        </form>
      </main>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  )
}
