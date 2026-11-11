import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { SectionHead } from './ui.jsx'
import MediaModal from './MediaModal.jsx'
import { PlayIcon } from './VideoModal.jsx'
import { SHOW_SAMPLE_STORIES, STORIES, STUDENTS, TRACK_LABEL, cld, mainVideo, poster } from '../data/students.js'

const showText = (s) => SHOW_SAMPLE_STORIES || !s.placeholder

function Avatar({ s, size = 40 }) {
  return s.photo
    ? <img className="sv-av" src={s.photo} alt="" width={size} height={size} loading="lazy" />
    : <span className="sv-av sv-av--init" style={{ width: size, height: size }} aria-hidden="true">{s.name.trim()[0]}</span>
}

// One viewer for every place a story can be opened. Videos never start by themselves: the viewer opens on the
// poster and the visitor presses play.
export function useStoryViewer() {
  const [curId, setCurId] = useState(null)
  const [tab, setTab] = useState(0)
  const s = curId ? STUDENTS.find((x) => x.id === curId) : null
  const idx = s ? STORIES.findIndex((x) => x.id === s.id) : -1

  const open = useCallback((st) => { setTab(0); setCurId(st.id) }, [])
  const step = useCallback((d) => {
    setTab(0)
    setCurId((id) => STORIES[(STORIES.findIndex((x) => x.id === id) + d + STORIES.length) % STORIES.length].id)
  }, [])

  let item = null
  if (s) {
    const versions = [
      s.short && { label: '1-min', id: s.short }, s.full && { label: 'Full story', id: s.full },
      s.short2 && { label: 'Part 2', id: s.short2 }, s.meetupVideo && { label: 'Meetup', id: s.meetupVideo },
    ].filter(Boolean)
    const cur = versions[Math.min(tab, versions.length - 1)]
    const isMeet = cur.id === s.meetupVideo
    item = {
      video: cld(cur.id, 'f_auto,q_auto,w_540'),
      poster: poster(cur.id, 540),
      landscape: isMeet && Boolean(s.meetupLandscape),
      title: s.name,
      avatar: s.photo,
      eyebrow: TRACK_LABEL[s.track] || 'Student story',
      chips: [TRACK_LABEL[s.track], isMeet ? 'Online meet' : 'Student story'].filter(Boolean),
      counter: idx >= 0 ? `${idx + 1} / ${STORIES.length}` : undefined,
      text: showText(s) ? [s.headline, s.story] : [`${TRACK_LABEL[s.track] || 'Career with Chaitanya'} learner`],
      quote: showText(s) ? s.quote : null,
      tabs: versions.map((v, i) => ({ label: v.label, on: v === cur, onClick: () => setTab(i) })),
      rail: STORIES.filter((x) => x.id !== s.id).slice(0, 10).map((x) => ({
        key: x.id, title: x.name, poster: poster(mainVideo(x), 200), onClick: () => open(x),
      })),
    }
  }
  const element = <MediaModal item={item} onClose={() => setCurId(null)} onPrev={() => step(-1)} onNext={() => step(1)} />
  return { open, element }
}

// Vertical story card: a still frame (no autoplay) with the student's name; pressing it opens the viewer.
export function StoryCard({ s, onOpen, small = false }) {
  const vid = mainVideo(s)
  return (
    <button className={`story ${small ? 'story--sm' : ''}`} onClick={() => onOpen(s)} aria-label={`Watch ${s.name}'s story`}>
      <span className="story__media">
        <img src={poster(vid, 360)} alt="" loading="lazy" />
        <span className="story__shade" />
        <span className="story__play"><PlayIcon size={small ? 36 : 44} /></span>
        <span className="story__who">
          <Avatar s={s} size={small ? 32 : 38} />
          <span><strong>{s.name}</strong><small>{TRACK_LABEL[s.track] || ''}</small></span>
        </span>
      </span>
      {!small && showText(s) && <span className="story__line">{s.headline}</span>}
    </button>
  )
}

// Home page: a scrolling row of story cards.
export function StudentStories({ limit, title = 'Student stories', sub = 'Real students, in their own words. Tap a story to watch.', cta = false, seeAll = false }) {
  const list = limit ? STORIES.slice(0, limit) : STORIES
  const row = useRef(null)
  const viewer = useStoryViewer()
  const scroll = (d) => row.current?.scrollBy({ left: d * (row.current.clientWidth * 0.8), behavior: 'smooth' })

  return (
    <section className="section" id="stories">
      <SectionHead eyebrow="Student stories" title={title} sub={sub}>
        {seeAll && <Link to="/testimonials" className="link">All testimonials →</Link>}
        {!seeAll && (
          <span className="story-nav">
            <button onClick={() => scroll(-1)} aria-label="Scroll left"><Icon name="arrow" size={18} className="flip" /></button>
            <button onClick={() => scroll(1)} aria-label="Scroll right"><Icon name="arrow" size={18} /></button>
          </span>
        )}
      </SectionHead>
      <div className="stories" ref={row}>
        {list.map((st) => <StoryCard key={st.id} s={st} onOpen={viewer.open} />)}
        {cta && (
          <Link to="/testimonials" className="story story--more">
            <Icon name="star" size={26} />
            <strong>+{STORIES.length - list.length} more stories</strong>
            <span>See every student story on the testimonials page.</span>
            <span className="btn btn--sm">See all stories</span>
          </Link>
        )}
      </div>
      {viewer.element}
    </section>
  )
}

// Compact carousel of story videos (used beside the recorded meets): arrows, a position counter, swipe on phones.
export function StoryCarousel() {
  const viewer = useStoryViewer()
  const track = useRef(null)
  const [pos, setPos] = useState(1)
  const page = () => {
    const el = track.current
    const card = el?.firstElementChild
    return card ? card.offsetWidth + 12 : 160
  }
  const onScroll = () => { const el = track.current; if (el) setPos(Math.min(STORIES.length, Math.round(el.scrollLeft / page()) + 1)) }
  const go = (d) => track.current?.scrollBy({ left: d * page() * 2, behavior: 'smooth' })

  return (
    <div className="scar">
      <div className="scar__head">
        <span><strong>Student stories</strong><small>Tap a card to watch</small></span>
        <span className="story-nav">
          <button onClick={() => go(-1)} aria-label="Previous stories"><Icon name="arrow" size={18} className="flip" /></button>
          <button onClick={() => go(1)} aria-label="Next stories"><Icon name="arrow" size={18} /></button>
        </span>
      </div>
      <div className="scar__track" ref={track} onScroll={onScroll}>
        {STORIES.map((s) => <StoryCard key={s.id} s={s} small onOpen={viewer.open} />)}
      </div>
      <div className="scar__foot">
        <span>{pos} / {STORIES.length}</span>
        <Link to="/testimonials" className="link">See all testimonials →</Link>
      </div>
      {viewer.element}
    </div>
  )
}

// Everyone with a photo, as a friendly wall. Tapping someone with a video opens their story.
export function StudentWall() {
  const people = STUDENTS.filter((s) => s.photo)
  const viewer = useStoryViewer()
  return (
    <section className="section" id="students">
      <SectionHead eyebrow="Our community" title="Meet our students" sub="The people learning, practising and getting hired with Career with Chaitanya." />
      <ul className="wall">
        {people.map((s) => {
          const has = Boolean(mainVideo(s))
          return (
            <li key={s.id}>
              <button className="wall__p" onClick={() => has && viewer.open(s)} disabled={!has} aria-label={has ? `Watch ${s.name}'s story` : s.name}>
                <img src={s.photo} alt={s.name} loading="lazy" width="240" height="300" />
                <span className="wall__cap"><strong>{s.name}</strong></span>
                {has && <span className="wall__play"><PlayIcon size={30} /></span>}
              </button>
            </li>
          )
        })}
      </ul>
      {viewer.element}
    </section>
  )
}
