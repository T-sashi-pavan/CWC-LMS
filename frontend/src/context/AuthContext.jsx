import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase.js'
import { api } from '../lib/api.js'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

const DEMO_KEY = 'cwc_demo_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabaseConfigured) {
      try {
        setUser(JSON.parse(localStorage.getItem(DEMO_KEY)))
      } catch {
        setUser(null)
      }
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => sub.subscription.unsubscribe()
  }, [])

  // Plan (free / pro) lives in our Django backend.
  useEffect(() => {
    if (!user) return setProfile(null)
    api('/me/').then(setProfile).catch(() => setProfile({ plan: 'free', is_pro: false }))
  }, [user])

  const signIn = async (email, password, captchaToken) => {
    if (!supabaseConfigured) return demoLogin(email)
    const { error } = await supabase.auth.signInWithPassword({ email, password, options: { captchaToken } })
    if (error) throw error
  }

  const signUp = async (email, password, fullName, captchaToken) => {
    if (!supabaseConfigured) return demoLogin(email, fullName)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName }, captchaToken, emailRedirectTo: window.location.origin },
    })
    if (error) throw error
    // Supabase hides "email already registered" by returning a user with no identities and sending no email.
    if (data.user && data.user.identities?.length === 0) {
      throw new Error('An account with this email already exists. Log in instead, or use Continue with Google.')
    }
    return { needsConfirmation: !data.session }
  }

  const signInGoogle = async () => {
    if (!supabaseConfigured) return demoLogin('demo@careerwithchaitanya.com')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
  }

  const demoLogin = (email, name = '') => {
    const u = { id: 'demo', email, user_metadata: { full_name: name } }
    localStorage.setItem(DEMO_KEY, JSON.stringify(u))
    setUser(u)
  }

  const signOut = async () => {
    if (supabaseConfigured) await supabase.auth.signOut()
    else localStorage.removeItem(DEMO_KEY)
    setUser(null)
  }

  const displayName =
    user?.user_metadata?.full_name || profile?.full_name || user?.email?.split('@')[0] || 'there'

  return (
    <AuthCtx.Provider
      value={{
        user, profile, loading, displayName,
        isPro: Boolean(profile?.is_pro),
        demo: !supabaseConfigured,
        signIn, signUp, signInGoogle, signOut,
      }}
    >
      {children}
    </AuthCtx.Provider>
  )
}
