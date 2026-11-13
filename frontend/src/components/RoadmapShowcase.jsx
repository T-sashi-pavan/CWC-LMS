import { Link } from 'react-router-dom'
import { useApi } from '../lib/useApi.js'
import { SectionHead } from './ui.jsx'
import Icon from './Icon.jsx'
import RoadmapCard from './RoadmapCard.jsx'

// Home page block: a few handpicked roadmaps, then a "log in for the rest" tile (visitors) or a link (members).
export default function RoadmapShowcase() {
  const { data } = useApi('/roadmaps/')
  if (!data || data.length === 0) return null
  const shown = data.filter((r) => r.featured).slice(0, 4)
  const picks = shown.length ? shown : data.slice(0, 4)
  const rest = data.length - picks.length
  const gated = data.some((r) => r.gated)

  return (
    <section className="section" id="roadmaps">
      <SectionHead eyebrow="Roadmaps" title="Choose your path" sub="Phase-by-phase plans with labs, tools and target roles.">
        <Link to="/roadmaps" className="link">All roadmaps →</Link>
      </SectionHead>
      <div className="rgrid rgrid--home">
        {picks.map((r, i) => <RoadmapCard key={r.id} r={r} index={data.indexOf(r)} />)}
        {gated && rest > 0 && (
          <Link to="/login?mode=signup" className="rmore">
            <Icon name="lock" size={26} />
            <strong>More roadmaps</strong>
            <span>Log in to see your interested roadmap guidance. It’s free.</span>
            <span className="btn btn--sm">Log in to unlock</span>
          </Link>
        )}
      </div>
    </section>
  )
}
