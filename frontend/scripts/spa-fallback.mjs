// After `vite build`: make dist/404.html a copy of index.html.
// Hosts like Vercel serve 404.html for unknown paths, so a hard refresh on /login or /jobs still loads the SPA
// even when no rewrite rule is applied (the router then renders the right page).
import { copyFileSync, existsSync } from 'node:fs'

if (existsSync('dist/index.html')) {
  copyFileSync('dist/index.html', 'dist/404.html')
  console.log('spa-fallback: dist/404.html created')
}
