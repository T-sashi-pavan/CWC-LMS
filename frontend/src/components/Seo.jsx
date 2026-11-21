import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE, pageFor } from '../seo/routes.js'

function meta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
  el.setAttribute('content', content)
}

// Keeps the title, description, canonical link and social tags in step with the page the visitor is on.
// (Search engines also get the same tags straight from the HTML files written at build time.)
export default function Seo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const p = pageFor(pathname)
    const url = `${SITE.url}${p.path === '/' ? '/' : p.path}`
    document.title = p.title
    meta('name', 'description', p.description)
    meta('name', 'robots', p.index === false ? 'noindex,nofollow' : 'index,follow')
    meta('property', 'og:title', p.title)
    meta('property', 'og:description', p.description)
    meta('property', 'og:url', url)
    meta('name', 'twitter:title', p.title)
    meta('name', 'twitter:description', p.description)
    let link = document.head.querySelector('link[rel="canonical"]')
    if (!link) { link = document.createElement('link'); link.setAttribute('rel', 'canonical'); document.head.appendChild(link) }
    link.setAttribute('href', url)
  }, [pathname])
  return null
}
