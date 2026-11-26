import { supabase } from './supabase.js'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

async function authHeader() {
  if (!supabase) return {}
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function api(path, options = {}) {
  const headers = { ...(await authHeader()), ...(options.headers || {}) }
  if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json'
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return res.json()
}
