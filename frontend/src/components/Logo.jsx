// "CWC" monogram for Career with Chaitanya: C - W - C drawn as one road.
// Each letter is a stretch of road with a dashed centre line; two walkers travel the whole route
// (C, then W, then C) and an orange arrow at the end points the way forward.
// `animate` draws the letters in one by one, then pops the arrow and starts the walkers (login page).
// `size` is the HEIGHT in px; the width follows the 160:80 aspect ratio.
const CYCLE = 7 // seconds for one full trip through C-W-C

// The letters are JOINED, not just placed side by side:
//  - the first C's upper tip leaves at 45° and becomes the W's first stroke,
//  - the W's last stroke arrives at 45° and runs tangent into the second C's curve (it becomes that C's top arc).
// So the whole monogram reads as one continuous road: C > W > C.
const C1 = 'M47 23A24 24 0 1 0 47 57'
const W = 'M47 23C55 31 60 48 64 64L78 34L92 64C96 48 101 31 109 23'
const C2 = 'M143 23A24 24 0 1 0 143 57'
// Walker route is one unbroken path: up C#1 (reversed), down and across the W, then along C#2's top arc to the arrow.
const ROUTE = 'M47 57A24 24 0 1 1 47 23C55 31 60 48 64 64L78 34L92 64C96 48 101 31 109 23A24 24 0 0 1 143 23'
const ASPECT = 160 / 80

function Walker({ r, fill, begin }) {
  return (
    <circle className="logo-dot" r={r} fill={fill} opacity="0">
      <animateMotion dur={`${CYCLE}s`} begin={begin} repeatCount="indefinite" path={ROUTE} />
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        keyTimes="0;0.06;0.92;1"
        dur={`${CYCLE}s`}
        begin={begin}
        repeatCount="indefinite"
      />
    </circle>
  )
}

export default function Logo({ size = 56, animate = false, mono = false, className = '' }) {
  // mono = for dark backgrounds: light road, dark dashes, dark walker so every part stays visible
  const road = mono ? '#EFE6D8' : 'var(--ink)'
  const dash = mono ? '#1B1815' : 'var(--cream)'
  const walker = mono ? '#1B1815' : 'var(--cream)'
  const start = animate ? 2.4 : 0 // wait for the letters to draw in on the login page
  const half = CYCLE / 2
  const begin1 = `${start}s`
  const begin2 = animate ? `${start + half}s` : `-${half}s`

  return (
    <svg
      className={`logo ${animate ? 'logo--draw' : ''} ${className}`}
      viewBox="-4 0 160 80"
      width={Math.round(size * ASPECT)}
      height={size}
      role="img"
      aria-label="Career with Chaitanya logo: C W C"
    >
      {[C1, W, C2].map((d, i) => (
        <g key={i}>
          <path
            className={`logo-road logo-road--${i + 1}`}
            pathLength="1"
            d={d}
            stroke={road}
            strokeWidth="11"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            className="logo-dash"
            d={d}
            stroke={dash}
            strokeWidth="1.6"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray="4 6"
          />
        </g>
      ))}
      <path className="logo-arrow" d="M136.6 29.4L149.4 16.6L152.9 32.9Z" fill="var(--orange-bright)" />
      <Walker r={4.6} fill={walker} begin={begin1} />
      <Walker r={3.2} fill="var(--orange-bright)" begin={begin2} />
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
