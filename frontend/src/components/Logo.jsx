// Vector version of the Career with Chaitanya "C-road" logo.
// `animate` draws the road, then pops the arrow and the two walkers (used on the login page).
export default function Logo({ size = 56, animate = false, mono = false, className = '' }) {
  const d = 'M70 22A36 36 0 1 0 70 78'
  // mono = for dark backgrounds: light road, dark dashes, dark walker so every part stays visible
  const road = mono ? '#EFE6D8' : 'var(--ink)'
  const dash = mono ? '#1B1815' : 'var(--cream)'
  const walker = mono ? '#1B1815' : 'var(--cream)'
  const begin = animate ? '1.8s' : '0s'
  return (
    <svg
      className={`logo ${animate ? 'logo--draw' : ''} ${className}`}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label="Career with Chaitanya logo"
    >
      <path className="logo-road" pathLength="1" d={d} stroke={road} strokeWidth="16" fill="none" />
      <path className="logo-dash" d={d} stroke={dash} strokeWidth="2" fill="none" strokeDasharray="6 8" />
      <path className="logo-arrow" d="M78.8 88.9L88.7 62.9L61.2 67.1Z" fill="var(--orange-bright)" />
      <circle className="logo-dot" r="6.5" fill={walker}>
        <animateMotion dur="4s" begin={begin} repeatCount="indefinite" path="M13.6 62.3A36 36 0 0 0 41.2 85.5" />
      </circle>
      <circle className="logo-dot" r="4.5" fill="var(--orange-bright)">
        <animateMotion dur="4s" begin={begin} repeatCount="indefinite" path="M26.8 79.5A36 36 0 0 0 65.4 81.2" />
      </circle>
    </svg>
  )
}

export function Wordmark({ light = false }) {
  return (
    <div className={`wordmark ${light ? 'wordmark--light' : ''}`}>
      <strong>Career</strong>
      <span>WITH CHAITANYA</span>
    </div>
  )
}
