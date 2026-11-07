// Career with Chaitanya mark: a light bulb ("the idea / the career spark").
//   - the glass is made of two C's: a dark C on the left and an orange C (facing the other way) on the right,
//   - a W sits inside the bulb,
//   - three base bars finish the bulb, and rays on top glow softly.
// The W is the filament: two support wires run down into the base, and a soft glow breathes behind it.
// `animate` plays the intro ONCE (draw in, then light the glow and rays) and stays lit: login page and heroes.
// `size` is the HEIGHT in px (the mark is about 2/3 as wide as it is tall).
// `tone`: 'auto' follows the page theme, 'dark' is for dark surfaces (hero), 'orange' is for the orange login panel.
// `mono` is kept as an alias for tone="dark".

import { useEffect, useState } from 'react'

// `once` logos (the heroes) play the intro only the first time in a page load, not on every tab change.
let introPlayed = false

const CX = 50
const CY = 46
const R = 28

const pt = (deg, r = R) => {
  const a = (deg * Math.PI) / 180
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
}
const f = ([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`

// left C: from the top, round the left side, then the neck narrows down into the base
const LEFT = `M${f(pt(-100))}A${R} ${R} 0 0 0 ${f(pt(128))}C38 73.5 40 80 41 88`
// right C (mirror image): same on the right
const RIGHT = `M${f(pt(-80))}A${R} ${R} 0 0 1 ${f(pt(52))}C62 73.5 60 80 59 88`
const W = 'M36 37L43 58L50 43L57 58L64 37'
const WIRES = ['M43 58L46.5 90', 'M57 58L53.5 90']
const BARS = ['M38 90H62', 'M42 97H58', 'M46 104H54']
const RAYS = [-150, -120, -90, -60, -30].map((deg, i) => ({
  d: `M${f(pt(deg, deg === -90 ? 35 : 32))}L${f(pt(deg, deg === -90 ? 45 : 38))}`,
  side: deg < -95 ? 'l' : 'r',
  i,
}))

const TONES = {
  auto: { glow: 'var(--orange-bright)', left: 'var(--ink)', right: 'var(--orange-bright)', w: 'var(--ink)', bars: 'var(--ink)' },
  dark: { glow: '#E0782E', left: '#EFE6D8', right: '#E0782E', w: '#EFE6D8', bars: '#EFE6D8' },
  orange: { glow: '#F4EDE1', left: '#1B1815', right: '#F4EDE1', w: '#1B1815', bars: '#1B1815' },
}

export default function Logo({ size = 56, animate: wantAnimate = false, once = false, mono = false, tone, className = '' }) {
  const [animate] = useState(() => wantAnimate && !(once && introPlayed))
  useEffect(() => {
    if (once) introPlayed = true
  }, [once])
  const t = TONES[tone || (mono ? 'dark' : 'auto')]
  const start = animate ? 2.4 : 0 // wait for the bulb to draw in on the login page

  return (
    <svg
      className={`logo ${animate ? 'logo--draw' : ''} ${className}`}
      viewBox="14 0 72 108"
      width={Math.round((size * 72) / 108)}
      height={size}
      role="img"
      aria-label="Career with Chaitanya logo: a light bulb with a W filament"
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {/* soft light behind the filament */}
      <circle cx={CX} cy="50" r="21" fill={t.glow} opacity={animate ? 0 : 0.16}>
        <animate attributeName="opacity" values={animate ? '0;0.26' : '0.1;0.26;0.1'} dur="3.2s" begin={`${start}s`} repeatCount={animate ? 1 : 'indefinite'} fill="freeze" />
      </circle>

      {/* the two C's that form the glass */}
      <path className="logo-road logo-road--1" pathLength="1" d={LEFT} stroke={t.left} strokeWidth="7" strokeLinecap="butt" />
      <path className="logo-road logo-road--3" pathLength="1" d={RIGHT} stroke={t.right} strokeWidth="7" strokeLinecap="butt" />

      {/* the W filament and its two support wires */}
      {WIRES.map((d) => (
        <path key={d} className="logo-road logo-road--2" pathLength="1" d={d} stroke={t.w} strokeWidth="2.4" />
      ))}
      <path className="logo-road logo-road--2" pathLength="1" d={W} stroke={t.w} strokeWidth="5.5" />

      {/* base bars */}
      {BARS.map((d) => (
        <path key={d} className="logo-arrow" d={d} stroke={t.bars} strokeWidth="4.2" />
      ))}

      {/* rays */}
      {RAYS.map((r) => (
        <path key={r.i} className="logo-arrow" d={r.d} stroke={r.side === 'l' ? t.left : t.right} strokeWidth="3.6">
          <animate attributeName="opacity" values={animate ? '0.3;1' : '1;0.3;1'} dur={animate ? '0.8s' : '2.8s'} begin={`${start + 0.3 * r.i}s`} repeatCount={animate ? 1 : 'indefinite'} fill="freeze" />
        </path>
      ))}
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

// Hero artwork: the bulb with the name beneath it. The name fades in after the bulb finishes its intro.
export function HeroMark({ size = 180 }) {
  const [intro] = useState(() => !introPlayed)
  return (
    <div className="hero__mark">
      <Logo size={size} animate once tone="dark" />
      <div className={`hero__brand ${intro ? 'hero__brand--intro' : ''}`}>
        <strong>Career</strong>
        <span>WITH CHAITANYA</span>
      </div>
    </div>
  )
}

// shared with the 3D hero mark
export const PATHS = { LEFT, RIGHT, W, WIRES, BARS }
