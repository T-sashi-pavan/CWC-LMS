import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// When the keys are missing the app runs in DEMO mode (no real auth) so the UI can still be shown.
export const supabaseConfigured = Boolean(url && key)
export const supabase = supabaseConfigured ? createClient(url, key) : null
export const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''
