import { useSyncExternalStore } from 'react'
import { api } from './api.js'

// Learning progress is stored in localStorage for instant UI and synced to /api/me/progress/
// when logged in so progress stays consistent across laptop and mobile.
const KEY = 'cwc_progress_v1'
const EMPTY = { watched: {}, last: { course: 'dsa', idx: 0 }, log: {}, visited: {} }

const load = () => {
  try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return EMPTY }
}

let state = load()
let wantPlay = false
let snapshot = { ...state, wantPlay }
let authed = false
let pushTimer = null
const subs = new Set()

const emit = () => {
  snapshot = { ...state, wantPlay }
  subs.forEach((f) => f())
}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* private mode */ } }
const today = () => new Date().toISOString().slice(0, 10)

function mergeState(a = {}, b = {}) {
  const watched = {}
  for (const src of [a.watched, b.watched]) {
    if (!src) continue
    for (const [k, arr] of Object.entries(src)) {
      const set = new Set([...(watched[k] || []), ...(Array.isArray(arr) ? arr : [])])
      watched[k] = [...set].sort((x, y) => x - y)
    }
  }
  const log = { ...(a.log || {}) }
  for (const [k, v] of Object.entries(b.log || {})) {
    log[k] = Math.max(log[k] || 0, Number(v) || 0)
  }
  const visited = { ...(a.visited || {}), ...(b.visited || {}) }
  const last = (b.last && b.last.course) ? b.last : ((a.last && a.last.course) ? a.last : EMPTY.last)
  return { watched, last, log, visited }
}

function schedulePush() {
  if (!authed) return
  clearTimeout(pushTimer)
  pushTimer = setTimeout(() => {
    api('/me/progress/', { method: 'PATCH', body: JSON.stringify(state) }).catch(() => {})
  }, 400)
}

export const progress = {
  select(course, idx = 0) {
    state = { ...state, last: { course, idx } }
    save(); emit(); schedulePush()
  },
  watch(course, idx) {
    const done = new Set(state.watched[course] || [])
    done.add(idx)
    const d = today()
    state = {
      ...state,
      watched: { ...state.watched, [course]: [...done] },
      last: { course, idx },
      log: { ...state.log, [d]: (state.log[d] || 0) + 1 },
    }
    save(); emit(); schedulePush()
  },
  visit(key) {
    if (state.visited[key]) return
    state = { ...state, visited: { ...state.visited, [key]: true } }
    save(); emit(); schedulePush()
  },
  async syncFromServer() {
    authed = true
    try {
      const remote = await api('/me/progress/')
      const merged = mergeState(state, remote)
      state = merged
      save(); emit()
      // Push any local-only progress back to the server so all devices stay in sync
      if (JSON.stringify(merged) !== JSON.stringify(remote)) {
        await api('/me/progress/', { method: 'PATCH', body: JSON.stringify(merged) }).catch(() => {})
      }
    } catch { /* offline or token expired: keep local */ }
  },
  reset() {
    authed = false
    clearTimeout(pushTimer)
    state = { ...EMPTY }
    try { localStorage.removeItem(KEY) } catch { /* ignore */ }
    emit()
  },
  resume() { wantPlay = true; emit() },
  consumePlay() { wantPlay = false; emit() },
}

export function useProgress() {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => subs.delete(cb) },
    () => snapshot,
  )
}

// ---------- derived stats ----------
export function stats(p) {
  const lessons = Object.values(p.watched).reduce((n, a) => n + a.length, 0)
  const tracks = Object.values(p.watched).filter((a) => a.length > 0).length

  const day = (offset) => {
    const d = new Date(); d.setDate(d.getDate() - offset)
    return d.toISOString().slice(0, 10)
  }
  // streak counts back from today; if nothing yet today, from yesterday so it doesn't reset at midnight
  let streak = 0
  let off = p.log[day(0)] ? 0 : 1
  while (p.log[day(off)]) { streak += 1; off += 1 }

  const week = [6, 5, 4, 3, 2, 1, 0].map((o) => {
    const d = new Date(); d.setDate(d.getDate() - o)
    return { label: d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 1), n: p.log[day(o)] || 0, today: o === 0 }
  })

  const badges = [
    { id: 'first', title: 'First step', hint: 'Watch 1 lesson', icon: 'sparkle', got: lessons >= 1 },
    { id: 'five', title: 'On a roll', hint: 'Watch 5 lessons', icon: 'star', got: lessons >= 5 },
    { id: 'explorer', title: 'Explorer', hint: 'Start 2 tracks', icon: 'route', got: tracks >= 2 },
    { id: 'streak', title: '3 day streak', hint: 'Learn 3 days in a row', icon: 'mic', got: streak >= 3 },
  ]
  const v = p.visited || {}
  const journey = [lessons >= 1, lessons >= 5, Boolean(v.openmic), Boolean(v.simulator), false]
  return { lessons, tracks, streak, week, badges, earned: badges.filter((b) => b.got).length, journey }
}
