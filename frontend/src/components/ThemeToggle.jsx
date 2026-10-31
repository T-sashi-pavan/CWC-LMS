import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'

const read = () => document.documentElement.getAttribute('data-theme') || 'light'

export default function ThemeToggle({ floating = false }) {
  const [theme, setTheme] = useState(read)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('cwc_theme', theme) } catch { /* private mode */ }
  }, [theme])

  const dark = theme === 'dark'
  return (
    <button
      type="button"
      className={`theme-toggle ${floating ? 'theme-toggle--float' : ''}`}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
    >
      <Icon name={dark ? 'sun' : 'moon'} size={18} />
    </button>
  )
}
