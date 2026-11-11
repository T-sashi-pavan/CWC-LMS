// Festival / announcement pop-ups. Add an entry, drop the image in /public/greetings, done.
// The first enabled entry whose date window contains today is shown (once per visit), so list the one you want first. `from` / `to` are inclusive
// (YYYY-MM-DD, local time), so an old greeting switches itself off. Set `enabled: false` to hide one early.
export const GREETINGS = [
  {
    // Welcome poster: Chaitanya sir with his students. No end date, so it shows until you replace or disable it.
    id: 'chaitanya-and-students',
    enabled: true,
    from: '2026-01-01',
    to: '2099-12-31',
    image: '/greetings/chaitanya-and-students.webp',
    alt: 'Career with Chaitanya: Guided by Chaitanya, succeeding together. Chaitanya sir in the centre, surrounded by portraits of his students.',
  },
  {
    // Diwali 2026 greeting: switched off, kept for reuse.
    id: 'diwali-2026',
    enabled: false,
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
