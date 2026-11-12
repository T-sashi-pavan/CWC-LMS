import { Link } from 'react-router-dom'
import { PageHead } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import CourseVideos from '../components/CourseVideos.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Courses() {
  const { user } = useAuth()
  return (
    <>
      <PageHead eyebrow="Free resources" title="Course videos">
        Free video playlists in Telugu and English, from Python and DSA to AI agents. Pick a course and learn at your own pace.
      </PageHead>
      <CourseVideos track={Boolean(user)} gated={!user} />
      {!user && (
        <section className="bigcta">
          <h2>Unlock every course.</h2>
          <p>Create a free account to watch every lesson and keep track of your progress.</p>
          <div className="hero__cta">
            <Link className="btn btn--lg" to="/login?mode=signup">Sign up free <Icon name="arrow" size={18} /></Link>
          </div>
        </section>
      )}
    </>
  )
}
