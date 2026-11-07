import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { SectionHead } from './ui.jsx'

const STEPS = [
  { icon: 'sparkle', title: 'Learn', text: 'Watch your first lesson on any track.', to: '#videos' },
  { icon: 'route', title: 'Build momentum', text: 'Get 5 lessons under your belt.', to: '#videos' },
  { icon: 'mic', title: 'Speak up', text: 'Join a CWC Open Mic meet.', to: '/open-mic' },
  { icon: 'bot', title: 'Simulate', text: 'Run the five-round interview.', to: '/interview-simulator' },
  { icon: 'star', title: 'Offer letter', text: 'Land the role you came for.', to: '/roadmaps' },
]

// The road to the offer letter. Logged out it is a preview; logged in `done` lights the steps up.
export default function Journey({ done = [], personal = false }) {
  const count = STEPS.findIndex((_, i) => !done[i])
  const reached = count === -1 ? STEPS.length : count // steps completed in a row
  const fill = personal ? (reached / (STEPS.length - 1)) * 100 : 100

  return (
    <section className="section journey-wrap" id="journey">
      <SectionHead
        eyebrow={personal ? 'Your journey' : 'The road ahead'}
        title="The road to your offer letter"
        sub={personal ? `${Math.min(reached, STEPS.length - 1)} of ${STEPS.length - 1} milestones reached. Each one lights up as you go.` : 'Five milestones. Every one of them is free to start.'}
      />
      <ol className="journey" style={{ '--fill': `${Math.min(fill, 100)}%` }}>
        {STEPS.map((s, i) => {
          const isDone = personal && Boolean(done[i])
          const isNow = personal && i === reached && i < STEPS.length
          const goal = i === STEPS.length - 1
          const Tag = s.to.startsWith('#') ? 'a' : Link
          const link = s.to.startsWith('#') ? { href: s.to } : { to: s.to }
          return (
            <li key={s.title} className={`jn ${isDone ? 'is-done' : ''} ${isNow ? 'is-now' : ''} ${goal ? 'is-goal' : ''}`} style={{ '--i': i }}>
              <Tag className="jn__card" {...link}>
                <span className="jn__node"><Icon name={isDone ? 'sparkle' : s.icon} size={20} /></span>
                {isNow && <span className="jn__here">You are here</span>}
                <strong>{s.title}</strong>
                <span>{s.text}</span>
              </Tag>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
