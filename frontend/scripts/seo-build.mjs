// After `vite build`: write one real HTML file per public page (dist/jobs/index.html, ...) with that page's own
// title, description, canonical link, social tags and a plain-text fallback, plus sitemap.xml.
// Why: the app is a single-page app, so every URL used to return the same generic HTML (and, on Vercel, a 404
// status for inner pages). Search engines and link previews now get the right tags and a 200 response up front.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { PAGES, SITE, jsonLd } from '../src/seo/routes.js'

const DIST = 'dist'
const src = join(DIST, 'index.html')
if (!existsSync(src)) { console.log('seo-build: dist/index.html missing, skipped'); process.exit(0) }
const template = readFileSync(src, 'utf8')

const START = '<!--seo:start-->'
const END = '<!--seo:end-->'
const a = template.indexOf(START)
const b = template.indexOf(END)
if (a < 0 || b < 0) { console.log('seo-build: seo markers missing in index.html, skipped'); process.exit(1) }

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const abs = (path) => `${SITE.url}${path === '/' ? '/' : path}`
const links = Object.entries(PAGES).filter(([, p]) => p.index !== false).map(([path, p]) => `<a href="${path}">${esc(p.h1)}</a>`).join(' ')

function head(path, p) {
  const url = abs(path)
  const lines = [
    `<title>${esc(p.title)}</title>`,
    `<meta name="description" content="${esc(p.description)}" />`,
    `<meta name="robots" content="${p.index === false ? 'noindex,nofollow' : 'index,follow'}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:title" content="${esc(p.title)}" />`,
    `<meta property="og:description" content="${esc(p.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE.url}${SITE.image}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${esc(p.title)}" />`,
    `<meta name="twitter:description" content="${esc(p.description)}" />`,
    `<meta name="twitter:image" content="${SITE.url}${SITE.image}" />`,
  ]
  if (path === '/') lines.push(`<script type="application/ld+json">${JSON.stringify(jsonLd())}</script>`)
  return `${START}\n    ${lines.join('\n    ')}\n    ${END}`
}

const noscript = (p) =>
  `<noscript><main><h1>${esc(p.h1)}</h1><p>${esc(p.text)}</p><p>${esc(p.description)}</p><nav>${links}</nav></main></noscript>`

let count = 0
for (const [path, p] of Object.entries(PAGES)) {
  let html = template.slice(0, a) + head(path, p) + template.slice(b + END.length)
  html = html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${noscript(p)}`)
  const out = path === '/' ? src : join(DIST, path, 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
  count += 1
}

const today = new Date().toISOString().slice(0, 10)
const urls = Object.entries(PAGES).filter(([, p]) => p.index !== false)
  .map(([path, p]) => `  <url><loc>${abs(path)}</loc><lastmod>${today}</lastmod><priority>${p.priority || '0.5'}</priority></url>`).join('\n')
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
console.log(`seo-build: wrote ${count} pages and sitemap.xml`)
