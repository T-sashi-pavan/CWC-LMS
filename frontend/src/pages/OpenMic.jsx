import { useEffect, useState } from 'react'
import { progress } from '../lib/progress.js'
import { Link } from 'react-router-dom'
import { PageHead, SectionHead } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { Embed, PlayIcon, Thumb } from '../components/VideoModal.jsx'
import { OPEN_MIC } from '../data/homeContent.js'

function Meets({ title, note, kind, items }) {
  return (
    <section className="section">
      <SectionHead eyebrow={kind} title={title} sub={note} />
      <div className="tickets">
        {items.map((m, k) => (
          <article key={k} className="ticket">
            <div className="ticket__date">
              <Icon name="mic" size={22} />
              <strong>{m.date}</strong>
              <span>{m.time}</span>
            </div>
            <div className="ticket__body">
              <h3>{m.place}</h3>
              <p className="muted">{m.text}</p>
              <Link className="btn btn--sm" to="/login?mode=signup">Reserve a spot <Icon name="arrow" size={15} /></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function OpenMic() {
  const [playing, setPlaying] = useState(false)
  useEffect(() => { progress.visit('openmic') }, [])
  const { demo } = OPEN_MIC
  return (
    <>
      <PageHead eyebrow="Community" title="CWC Open Mic">
        A friendly stage to practise speaking, share ideas and meet people on the same path.
      </PageHead>

      <section className="section">
        <SectionHead eyebrow="Watch" title="See an Open Mic in action" />
        <div className="ratio cv__player">
          {playing ? <Embed yt={demo.yt} title={demo.title} /> : (
            <button className="vc__poster" onClick={() => setPlaying(true)} aria-label={`Play: ${demo.title}`}>
              <Thumb yt={demo.yt} />
              <span className="vc__shade" />
              <PlayIcon size={72} />
            </button>
          )}
        </div>
      </section>

      <Meets kind="Online" title="Online meets" note="Join from anywhere." items={OPEN_MIC.online} />
      <Meets kind="Offline" title="Offline meets" note="Meet your mentors in person." items={OPEN_MIC.offline} />
    </>
  )
}
