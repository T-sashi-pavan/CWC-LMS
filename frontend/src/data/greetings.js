// Festival / announcement pop-ups. Add an entry, drop the image in /public/greetings, done.
// The first entry whose date window contains today is shown (once per visit). `from` / `to` are inclusive
// (YYYY-MM-DD, local time), so an old greeting switches itself off. Set `enabled: false` to hide one early.
export const GREETINGS = [
  {
    id: 'diwali-2026',
    enabled: true,
    from: '2026-11-06',
    to: '2026-11-12',
    image: '/greetings/diwali-2026.webp',
    alt: 'Wishing you a Happy Diwali from Career with Chaitanya: may the light of Diwali remove doubts and bring clarity, new opportunities and greater success in your learning, career and life.',
  },
]

const ymd = (d) => {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function activeGreeting(now = new Date()) {
  const today = ymd(now)
  return GREETINGS.find((g) => g.enabled && today >= g.from && today <= g.to) || null
}
