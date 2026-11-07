import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SEL = '.section, .strip, .bigcta, .fcard, .track, .vcard, .stat, .panel, .jn, .ticket, .path__step, .steps3 li, .welcome'

// Fade-and-rise as sections scroll into view. Only elements below the fold get hidden first,
// so nothing flashes, and everything stays visible if IntersectionObserver is missing.
export default function useReveal() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })

    const t = setTimeout(() => {
      document.querySelectorAll(SEL).forEach((el) => {
        if (el.classList.contains('rv')) return
        if (el.getBoundingClientRect().top < window.innerHeight) return
        const sib = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0
        el.style.setProperty('--d', `${(sib % 5) * 70}ms`)
        el.classList.add('rv')
        io.observe(el)
      })
    }, 60)
    return () => { clearTimeout(t); io.disconnect() }
  }, [pathname])
}
