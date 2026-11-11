import data from './courses.json'

// Real playlists from the YouTube channel. Regenerate with:  python scripts/sync_youtube.py
export const PLAYLISTS = data.playlists
export const CHANNEL = data.channel
export const FREE_PER_COURSE = 5 // lessons per course a visitor can watch before logging in
// The only courses a visitor sees on the home page (by tab label); the rest unlock after a free login.
export const PUBLIC_COURSES = ['Python', 'LangChain', 'LLMs']

export const TOTAL_VIDEOS = PLAYLISTS.reduce((n, p) => n + p.videos.length, 0)
export const TOTAL_HOURS = Math.round(PLAYLISTS.reduce((n, p) => n + p.hours, 0))

export const fmt = (s) => {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`
}
export const findPlaylist = (id) => PLAYLISTS.find((p) => p.id === id) || PLAYLISTS[0]
export const ytThumb = (id, q = 'mqdefault') => `https://i.ytimg.com/vi/${id}/${q}.jpg`
