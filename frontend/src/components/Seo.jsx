import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE, pageFor } from '../seo/routes.js'

function meta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
  el.setAttribute('content', content)
}

// Sets the title, description, canonical link and social tags for one page.
export function applyMeta({ title, description, path, noindex = false }) {
  const url = `${SITE.url}${path === '/' ? '/' : path}`
  document.title = title
  meta('name', 'description', description)
  meta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow')
  meta('property', 'og:title', title)
  meta('property', 'og:description', description)
  meta('property', 'og:url', url)
  meta('name', 'twitter:title', title)
  meta('name', 'twitter:description', description)
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) { link = document.createElement('link'); link.setAttribute('rel', 'canonical'); document.head.appendChild(link) }
  link.setAttribute('href', url)
}

// Keeps the tags in step with the page the visitor is on. (Search engines also get the same tags straight from
// the HTML files written at build time, see scripts/seo-build.mjs.) Pages whose text depends on loaded data,
// such as a single roadmap, call applyMeta themselves once the data is there.
export default function Seo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const p = pageFor(pathname)
    applyMeta({ title: p.title, description: p.description, path: p.path, noindex: p.index === false })
  }, [pathname])
  return null
}
