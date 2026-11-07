import { useRef } from 'react'
import { PATHS } from './Logo.jsx'

const LAYERS = 16
const GAP = 3 // px between slices: 16 x 3 = about 48px of depth

// One flat slice of the bulb mark. Stacked along Z they read as a solid, extruded 3D logo.
function Slice({ z, front }) {
  const style = { transform: `translateZ(${z}px)` }
  const left = front ? 'var(--ink)' : 'var(--ex-ink)'
  const right = front ? 'var(--orange-bright)' : 'var(--ex-orange)'
  return (
    <svg className="l3d__slice" style={style} viewBox="14 0 72 108" fill="none" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <path d={PATHS.LEFT} stroke={left} strokeWidth="7" strokeLinecap="butt" />
      <path d={PATHS.RIGHT} stroke={right} strokeWidth="7" strokeLinecap="butt" />
      {PATHS.WIRES.map((d) => <path key={d} d={d} stroke={left} strokeWidth="2.4" />)}
      <path d={PATHS.W} stroke={front ? 'var(--orange-bright)' : 'var(--ex-orange)'} strokeWidth="5.5" />
      {PATHS.BARS.map((d) => <path key={d} d={d} stroke={left} strokeWidth="5" />)}
    </svg>
  )
}

// 3D bulb mark with orbiting rings. Follows the cursor a little; swings on its own otherwise.
export default function Logo3D({ className = '', label = 'Career with Chaitanya logo' }) {
  const tilt = useRef(null)
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    tilt.current?.style.setProperty('--rx', `${(-y * 14).toFixed(1)}deg`)
    tilt.current?.style.setProperty('--ry', `${(x * 18).toFixed(1)}deg`)
  }
  const leave = () => {
    tilt.current?.style.setProperty('--rx', '0deg')
    tilt.current?.style.setProperty('--ry', '0deg')
  }
  return (
    <div className={`l3d ${className}`} onMouseMove={move} onMouseLeave={leave} role="img" aria-label={label}>
      <div className="l3d__glow" />
      <div className="l3d__tilt" ref={tilt}>
        <i className="l3d__ring l3d__ring--a" />
        <i className="l3d__ring l3d__ring--b" />
        <div className="l3d__obj">
          {Array.from({ length: LAYERS }, (_, i) => (
            <Slice key={i} z={(i - LAYERS / 2) * GAP} front={i === LAYERS - 1} />
          ))}
        </div>
      </div>
    </div>
  )
}
