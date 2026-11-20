// Remembers the page a visitor was on before they went to log in, so every login method
// (email or Google/OAuth) can send them back there. sessionStorage survives the OAuth round trip.
const LAST = 'cwc_last_path'
const NEXT = 'cwc_after_login'
const read = (k) => { try { return sessionStorage.getItem(k) } catch { return null } }
const write = (k, v) => { try { v == null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v) } catch { /* private mode */ } }

export const trackPath = (path) => { if (path && !path.startsWith('/login')) write(LAST, path) }
export const lastPath = () => read(LAST) || '/'
export const rememberDest = (path) => write(NEXT, path)
export const takeDest = () => { const p = read(NEXT); write(NEXT, null); return p }
