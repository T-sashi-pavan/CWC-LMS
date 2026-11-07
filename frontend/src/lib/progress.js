import { useSyncExternalStore } from 'react'

// Learning progress lives in this browser (localStorage) so the dashboard shows real activity
// without needing new backend tables. Swap for an API later if progress should follow the user.
const KEY = 'cwc_progress_v1'
const EMPTY = { watched: {}, last: { course: 'dsa', idx: 0 }, log: {}, visited: {} }

const load = () => {
  try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return EMPTY }
}

let state = load()
let wantPlay = false
let snapshot = { ...state, wantPlay }
const subs = new Set()

const emit = () => {
  snapshot = { ...state, wantPlay }
  subs.forEach((f) => f())
}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* private mode */ } }
const today = () => new Date().toISOString().slice(0, 10)

export const progress = {
  select(course, idx = 0) { state = { ...state, last: { course, idx } }; save(); emit() },
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
    save(); emit()
  },
  visit(key) {
    if (state.visited[key]) return
    state = { ...state, visited: { ...state.visited, [key]: true } }
    save(); emit()
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
