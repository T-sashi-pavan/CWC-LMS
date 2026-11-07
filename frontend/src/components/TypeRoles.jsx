import { useEffect, useState } from 'react'

const ROLES = ['Software Developer', 'Data Analyst', 'Confident Speaker', 'Interview Ready']
const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// "Become a ____": types and erases the roles Chaitanya's students aim for.
export default function TypeRoles() {
  const [text, setText] = useState(reduced() ? ROLES[0] : '')
  useEffect(() => {
    if (reduced()) return undefined
    let i = 0; let n = 0; let del = false; let t
    const tick = () => {
      const word = ROLES[i]
      n += del ? -1 : 1
      setText(word.slice(0, n))
      let wait = del ? 35 : 70
      if (!del && n === word.length) { del = true; wait = 1400 }
      else if (del && n === 0) { del = false; i = (i + 1) % ROLES.length; wait = 350 }
      t = setTimeout(tick, wait)
    }
    t = setTimeout(tick, 600)
    return () => clearTimeout(t)
  }, [])
  return (
    <p className="typer" aria-label={`Become a ${ROLES[0]}, ${ROLES.slice(1).join(', ')}`}>
      <span className="typer__lead">Become a</span>
      <span className="typer__word" aria-hidden="true">{text}<i className="typer__caret" /></span>
    </p>
  )
}
