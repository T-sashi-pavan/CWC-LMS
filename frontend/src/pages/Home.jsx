import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useApi } from '../lib/useApi.js'
import { stats, useProgress } from '../lib/progress.js'
import { Async, Lock, SectionHead } from '../components/ui.jsx'
import CourseVideos from '../components/CourseVideos.jsx'
import { FeatureCards } from '../components/HomeSections.jsx'
import HiredStudents from '../components/HiredStudents.jsx'
import LinkedInPosts from '../components/LinkedInPosts.jsx'
import { StudentStories, StudentWall } from '../components/StudentStories.jsx'
import { ActivityChart, Badges, Resume, StatTiles } from '../components/dash.jsx'
import Logo, { MarkName } from '../components/Logo.jsx'
import RoadmapShowcase from '../components/RoadmapShowcase.jsx'
import Journey from '../components/Journey.jsx'
import BadgeCelebration from '../components/Confetti.jsx'

export default function Home() {
  const { displayName, isPro } = useAuth()
  const jobs = useApi('/jobs/')
  const p = useProgress()
  const s = stats(p)

  return (
    <div className="dash">
      <BadgeCelebration badges={s.badges} />
      <div className="dash__main">
        <section className="welcome welcome--sun">
          <div className="welcome__text">
            <span className="eyebrow">Welcome back, {displayName}</span>
            <Resume p={p} />
            <p className="welcome__streak">{s.streak > 0 ? `${s.streak} day streak. Keep it going.` : 'Watch a lesson today to start your streak.'}</p>
          </div>
          <div className="welcome__art">
            <Logo size={210} animate once />
            <MarkName />
          </div>
        </section>

        <StatTiles s={s} />
        <Journey personal done={s.journey} />
        <FeatureCards eyebrow="Jump in" title="Practise, speak and plan" sub="Your three shortcuts to getting job-ready." />
        <RoadmapShowcase />
        <CourseVideos track />

        <section className="section">
          <SectionHead eyebrow="Your progress" title="Activity and badges" />
          <div className="duo">
            <ActivityChart s={s} />
            <Badges s={s} />
          </div>
        </section>

        <HiredStudents />
        <StudentStories />
        <StudentWall />

        {!isPro && (
          <section className="promo">
            <div>
              <span className="eyebrow eyebrow--orange">Pro · ₹499</span>
              <h2>Take the next level</h2>
              <p>Video simulation interviews, next-level AI interview, bigger job openings and mock interviews with more features.</p>
            </div>
            <Link className="btn" to="/pro">See what’s in Pro</Link>
          </section>
        )}

        <section className="section">
          <SectionHead eyebrow="Careers" title="Latest job openings">
            <Link to="/jobs" className="link">View all →</Link>
          </SectionHead>
          <Async state={jobs}>
            {(list) => (
              <div className="grid">
                {list.slice(0, 4).map((j) => (
                  <div key={j.id} className="card job">
                    <div>
                      <h3>{j.title}</h3>
                      <p className="muted">{j.company} · {j.location}</p>
                    </div>
                    {j.locked ? <Lock /> : <span className="chip">{j.salary || j.job_type}</span>}
                  </div>
                ))}
              </div>
            )}
          </Async>
        </section>

        <LinkedInPosts seeAll />
      </div>

    </div>
  )
}
