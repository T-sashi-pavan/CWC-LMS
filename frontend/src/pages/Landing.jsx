import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { PublicLayout } from '../components/PublicLayout.jsx'
import RoadmapShowcase from '../components/RoadmapShowcase.jsx'
import Journey from '../components/Journey.jsx'
import Logo, { MarkName } from '../components/Logo.jsx'
import TypeRoles from '../components/TypeRoles.jsx'
import { SectionHead } from '../components/ui.jsx'
import CourseVideos from '../components/CourseVideos.jsx'
import { StudentStories } from '../components/StudentStories.jsx'
import HiredStudents from '../components/HiredStudents.jsx'
import LinkedInPosts from '../components/LinkedInPosts.jsx'
import { FeatureCards } from '../components/HomeSections.jsx'
import { ROUNDS } from '../data/homeContent.js'
import { TOTAL_HOURS, TOTAL_VIDEOS } from '../data/courses.js'

const SIGNUP = '/login?mode=signup'

const STEPS = [
  { n: '01', icon: 'sparkle', title: 'Create a free account', text: 'It takes a minute. No card needed.' },
  { n: '02', icon: 'route', title: 'Follow your roadmap', text: 'Know exactly what to learn and in what order.' },
  { n: '03', icon: 'mic', title: 'Practise and get hired', text: 'Mock interviews, open mics and live openings in one place.' },
]

export default function Landing() {
  return (
    <PublicLayout>
      <section className="hero3">
        <h1 className="hero3__title">
          <span className="hero3__a">Learn.</span>
          <span className="hero3__b">Practise.</span>
          <span className="hero3__c grad">Get hired.</span>
        </h1>

        <div className="hero3__stage">
          <div className="hero3__bulb">
            <Logo size={420} animate once />
          </div>
          <MarkName />
        </div>

        <div className="hero3__copy">
          <TypeRoles />
          <p>
            Video courses, role roadmaps, mock interviews and a friendly open mic, guided by Chaitanya.
            Everything you need for your first offer letter, in one place.
          </p>
          <div className="hero__cta">
            <Link className="btn btn--lg" to={SIGNUP}>Get started free <Icon name="arrow" size={18} /></Link>
            <Link className="btn btn--outline btn--lg" to="/login">I have an account</Link>
          </div>
        </div>
      </section>

      <section className="strip" aria-label="At a glance">
        <div><strong>{TOTAL_VIDEOS}</strong><span>free video lessons</span></div>
        <div><strong>{TOTAL_HOURS}+</strong><span>hours of learning</span></div>
        <div><strong>{ROUNDS.length}</strong><span>interview rounds</span></div>
        <div><strong>₹0</strong><span>to get started</span></div>
      </section>

      <Journey />
      <FeatureCards />
      <RoadmapShowcase />
      <CourseVideos gated />
      <HiredStudents />

      <section className="section" id="how">
        <SectionHead eyebrow="How it works" title="Three steps to your first offer" />
        <ol className="steps3">
          {STEPS.map((s) => (
            <li key={s.n}>
              <span className="steps3__n">{s.n}</span>
              <span className="tile__icon"><Icon name={s.icon} size={22} /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <StudentStories limit={5} cta />

      <LinkedInPosts seeAll />

      <section className="bigcta">
        <h2>Your next role starts here.</h2>
        <p>Create your free account and unlock every course, roadmap and mock interview.</p>
        <div className="hero__cta">
          <Link className="btn btn--lg" to={SIGNUP}>Sign up free</Link>
          <Link className="btn btn--cream btn--lg" to="/login">Log in</Link>
        </div>
      </section>
    </PublicLayout>
  )
}
