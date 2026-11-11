import { Link } from 'react-router-dom'
import { PageHead } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import LinkedInPosts from '../components/LinkedInPosts.jsx'
import { StudentWall } from '../components/StudentStories.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Testimonials() {
  const { user } = useAuth()
  return (
    <>
      <PageHead eyebrow="Testimonials" title="Watch the improvements of our students">
        Real students, real progress. See how they learned, practised and moved forward with Career with Chaitanya.
      </PageHead>

      <LinkedInPosts title="Our students on LinkedIn" sub="Students share their improvements and wins in their own posts." />
      <StudentWall />

      <section className="bigcta">
        <h2>Be our next success story.</h2>
        <p>{user ? 'Pick a roadmap, follow the lessons and share your own progress.' : 'Create a free account and start your own journey today.'}</p>
        <div className="hero__cta">
          {user
            ? <Link className="btn btn--lg" to="/roadmaps">Choose your roadmap <Icon name="arrow" size={18} /></Link>
            : <><Link className="btn btn--lg" to="/login?mode=signup">Sign up free</Link><Link className="btn btn--cream btn--lg" to="/roadmaps">See roadmaps</Link></>}
        </div>
      </section>
    </>
  )
}
