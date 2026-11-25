import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHead, SectionHead } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import MediaModal from '../components/MediaModal.jsx'
import { StoryCarousel } from '../components/StudentStories.jsx'
import { PlayIcon } from '../components/VideoModal.jsx'
import { useApi } from '../lib/useApi.js'
import { progress } from '../lib/progress.js'
import { OPEN_MIC } from '../data/homeContent.js'
import { STUDENTS, TRACK_LABEL, cld, poster } from '../data/students.js'
import photos from '../data/meetups.json'
import OfflineCarousel from '../components/OfflineCarousel.jsx'

// longest recording first: it becomes the featured one
const RECORDINGS = STUDENTS.filter((s) => s.meetupVideo).sort((a, b) => (b.meetupSeconds || 0) - (a.meetupSeconds || 0))
const mmss = (s) => (s ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : '')
const pad = (n) => String(n).padStart(2, '0')

function Host({ s, size = 40 }) {
  return s.photo
    ? <img className="sv-av" src={s.photo} alt={s.name} width={size} height={size} loading="lazy" />
    : <span className="sv-av sv-av--init" style={{ width: size, height: size }}>{s.name[0]}</span>
}

function OnlineMeets({ title, note, kind, items }) {
  return (
    <section className="section">
      <SectionHead eyebrow={kind} title={title} sub={note} />
      <div className={`tickets ${items.length === 1 ? 'tickets--single' : ''}`}>
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
              <a className="btn btn--sm" href={m.form} target="_blank" rel="noopener noreferrer">
                Reserve a spot <Icon name="arrow" size={15} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function OfflineMeets({ formUrl }) {
  const { data, loading } = useApi('/offline-meets/')
  const meets = data?.meets || []
  const hasMeets = meets.length > 0

  return (
    <section className="section">
      <SectionHead eyebrow="Offline" title="Meet in person" note="Meet your mentors in person." sub="Meet your mentors in person." />
      {loading ? (
        <div className="tickets tickets--single">
          <article className="ticket">
            <div className="ticket__date">
              <Icon name="mic" size={22} />
              <strong>Checking…</strong>
              <span>Schedule</span>
            </div>
            <div className="ticket__body">
              <h3>Loading offline meets</h3>
              <p className="muted">Fetching the latest meetup schedule…</p>
            </div>
          </article>
        </div>
      ) : hasMeets ? (
        <div className={`tickets ${meets.length === 1 ? 'tickets--single' : ''}`}>
          {meets.map((m, k) => (
            <article key={k} className="ticket">
              <div className="ticket__date">
                <Icon name="mic" size={22} />
                <strong>{m.date || 'Upcoming'}</strong>
                <span>{[m.day, m.timing].filter(Boolean).join(' · ')}</span>
              </div>
              <div className="ticket__body">
                <h3>{m.city || 'Offline Meet'}</h3>
                <p className="muted">{m.location || 'Venue details to be shared.'}</p>
                <div className="ticket__actions">
                  <a className="btn btn--sm" href={formUrl} target="_blank" rel="noopener noreferrer">
                    Reserve a spot <Icon name="arrow" size={15} />
                  </a>
                  {m.map_link && (
                    <a className="btn btn--sm btn--outline" href={m.map_link} target="_blank" rel="noopener noreferrer">
                      View map <Icon name="arrow" size={14} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="tickets tickets--single">
          <article className="ticket ticket--unavailable">
            <div className="ticket__date">
              <Icon name="mic" size={22} />
              <strong>Unavailable</strong>
              <span>No active meets</span>
            </div>
            <div className="ticket__body">
              <h3>Meets unavailable</h3>
              <p className="muted">No offline meets are scheduled right now. Check back soon for upcoming city dates.</p>
              <button type="button" className="btn btn--sm ticket__disabled" disabled aria-disabled="true">
                Reserve a spot
              </button>
            </div>
          </article>
        </div>
      )}
    </section>
  )
}

export default function OpenMic() {
  const [rec, setRec] = useState(null)   // index into RECORDINGS
  const [shot, setShot] = useState(null) // index into photos
  useEffect(() => { progress.visit('openmic') }, [])

  const stepRec = useCallback((d) => setRec((i) => (i + d + RECORDINGS.length) % RECORDINGS.length), [])
  const stepShot = useCallback((d) => setShot((i) => (i + d + photos.length) % photos.length), [])

  const r = rec === null ? null : RECORDINGS[rec]
  const recItem = r && {
    video: cld(r.meetupVideo, 'f_auto,q_auto,w_720'),
    poster: poster(r.meetupVideo, 720),
    landscape: Boolean(r.meetupLandscape),
    title: `Meetup · ${r.name}`,
    avatar: r.photo,
    eyebrow: 'Online meet',
    chips: ['Online meet', TRACK_LABEL[r.track], r.meetupSeconds && mmss(r.meetupSeconds)].filter(Boolean),
    text: [`${r.name} in a Career with Chaitanya online meet.`, 'Recorded from a live session of the CWC Open Mic community.'],
  }
  const lightbox = shot === null ? null : {
    image: `/meetups/m${pad(photos[shot].n)}.webp`,
    title: 'Meetup photo',
    thumbs: photos.map((p, i) => ({ src: `/meetups/m${pad(p.n)}-sm.webp`, on: i === shot, onClick: () => setShot(i), label: `Photo ${i + 1}` })),
  }

  const [feat, ...rest] = RECORDINGS

  return (
    <>
      <PageHead eyebrow="Community" title="CWC Open Mic">
        A friendly stage to practise speaking, share ideas and meet people on the same path.
      </PageHead>

      <section className="section section--room">
        <SectionHead eyebrow="Offline meets" title="In the room" sub="Moments from our offline sessions and workshops." />
        <OfflineCarousel photos={photos} onOpen={setShot} />
      </section>

      <section className="section">
        <SectionHead eyebrow="Online meets" title="Watch recent meets" sub="Recordings from our online sessions: students presenting, explaining and answering questions.">
          <span className="chip">Recordings</span>
        </SectionHead>
        <div className="meetx">
          <button className="mfeat" onClick={() => setRec(0)} aria-label={`Play meetup: ${feat.name}`}>
            <span className="mfeat__img">
              <img src={poster(feat.meetupVideo, 960)} alt={`Online meet by ${feat.name}`} loading="lazy" />
              <span className="mfeat__shade" />
              <span className="mtag"><i /> Featured · Online meet</span>
              {feat.meetupSeconds && <span className="mdur">{mmss(feat.meetupSeconds)}</span>}
              <PlayIcon size={78} />
            </span>
            <span className="mfeat__foot">
              <Host s={feat} size={48} />
              <span className="mfeat__txt">
                <strong>Meetup · {feat.name}</strong>
                <small>{TRACK_LABEL[feat.track] || 'Open Mic'} · recorded session</small>
              </span>
              <span className="mfeat__go">Watch <Icon name="arrow" size={16} /></span>
            </span>
          </button>

          <div className="meetx__list">
            {rest.map((s, i) => (
              <button key={s.id} className="mrow" onClick={() => setRec(i + 1)} aria-label={`Play meetup: ${s.name}`}>
                <span className="mrow__img">
                  <img src={poster(s.meetupVideo, 360)} alt={`Online meet by ${s.name}`} loading="lazy" />
                  <PlayIcon size={36} />
                  {s.meetupSeconds && <span className="mdur">{mmss(s.meetupSeconds)}</span>}
                </span>
                <span className="mrow__txt">
                  <span className="mtag mtag--sm">Online meet</span>
                  <strong>Meetup · {s.name}</strong>
                  <small>{TRACK_LABEL[s.track] || 'Open Mic'}</small>
                </span>
              </button>
            ))}
            <StoryCarousel />
          </div>
        </div>
      </section>

      <OnlineMeets title="Join an online meet" note="Join from anywhere." kind="Online" items={OPEN_MIC.online} />

      <OfflineMeets formUrl={OPEN_MIC.offlineForm} />

      <section className="section">
        <SectionHead eyebrow="Offline meets" title="More moments" sub="Tap a photo to see it full size." />
        <div className="gallery">
          {photos.map((p, i) => (
            <button key={p.n} className="gallery__item" onClick={() => setShot(i)} aria-label={`Open photo ${i + 1}`}>
              <img src={`/meetups/m${pad(p.n)}-sm.webp`} alt={`Offline meet photo ${i + 1}`} loading="lazy" width={480} height={Math.round((480 * p.h) / p.w)} />
            </button>
          ))}
        </div>
      </section>

      <MediaModal item={recItem} onClose={() => setRec(null)} onPrev={RECORDINGS.length > 1 ? () => stepRec(-1) : undefined} onNext={RECORDINGS.length > 1 ? () => stepRec(1) : undefined} />
      <MediaModal item={lightbox} onClose={() => setShot(null)} onPrev={() => stepShot(-1)} onNext={() => stepShot(1)} />
    </>
  )
}
