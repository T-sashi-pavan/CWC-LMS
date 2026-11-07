import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export function PageHead({ eyebrow, title, children }) {
  return (
    <div className="pagehead">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  )
}

export function Async({ state, children }) {
  if (state.loading) {
    return (
      <div className="grid">
        {[0, 1, 2].map((i) => <div key={i} className="card skeleton" />)}
      </div>
    )
  }
  if (state.error) {
    return (
      <div className="card empty">
        <p>Couldn’t load this right now ({state.error}).</p>
        <p className="muted">Is the Django backend running on the API URL in your .env?</p>
        <button className="btn" onClick={state.reload}>Try again</button>
      </div>
    )
  }
  return children(state.data)
}

export function Lock({ children = 'Pro' }) {
  return <span className="lock"><Icon name="lock" size={15} /> {children}</span>
}

export function UpgradeLink({ children = 'Unlock with Pro · ₹499' }) {
  return <Link to="/pro" className="btn btn--sm">{children}</Link>
}

export function SectionHead({ eyebrow, title, sub, children }) {
  return (
    <div className="sh">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {sub && <p className="muted">{sub}</p>}
      </div>
      {children}
    </div>
  )
}
