import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { takeDest, trackPath } from './lib/afterLogin.js'
import AppLayout from './components/AppLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Landing from './pages/Landing.jsx'
import Home from './pages/Home.jsx'
import Roadmaps from './pages/Roadmaps.jsx'
import Interviews from './pages/Interviews.jsx'
import Jobs from './pages/Jobs.jsx'
import Testimonials from './pages/Testimonials.jsx'
import About from './pages/About.jsx'
import OpenMic from './pages/OpenMic.jsx'
import InterviewSimulator from './pages/InterviewSimulator.jsx'
import RoadmapDetail from './pages/RoadmapDetail.jsx'
import CourseTracks from './pages/CourseTracks.jsx'
import FresherCourses from './pages/FresherCourses.jsx'
import ExperiencedCourses from './pages/ExperiencedCourses.jsx'
import CrackCompany from './pages/CrackCompany.jsx'
import Courses from './pages/Courses.jsx'
import SiteLayout from './components/PublicLayout.jsx'
import Seo from './components/Seo.jsx'
import GreetingPopup from './components/GreetingPopup.jsx'
import { JobsNudge } from './components/JobsSpotlight.jsx'
import { SimulatorNudge } from './components/SimulatorSpotlight.jsx'
import { useAuth } from './context/AuthContext.jsx'

// "/" is the public storefront for visitors and the full dashboard once logged in.
function HomeGate() {
  const { user, loading } = useAuth()
  if (loading) return <div className="splash">Loading…</div>
  return user ? <AppLayout><Home /></AppLayout> : <Landing />
}

// Tracks where the visitor is, and after a login (including Google/OAuth, which reloads the app on "/")
// sends them to the page they started from.
function AfterLogin() {
  const { user, loading } = useAuth()
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    trackPath(pathname + search)
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID
    if (gaId && typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', gaId, { page_path: pathname + search })
    }
  }, [pathname, search])
  useEffect(() => {
    if (!hash) return
    const id = hash.slice(1)
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => clearTimeout(timer)
  }, [pathname, hash])
  useEffect(() => {
    if (loading || !user) return
    const dest = takeDest()
    if (dest && dest !== pathname + search) navigate(dest, { replace: true })
  }, [user, loading]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

export default function App() {
  return (
    <>
    <AfterLogin />
    <Seo />
    <GreetingPopup />
    <JobsNudge />
    <SimulatorNudge />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<HomeGate />} />
      <Route path="/roadmaps" element={<SiteLayout><Roadmaps /></SiteLayout>} />
      <Route path="/roadmaps/:slug" element={<SiteLayout><RoadmapDetail /></SiteLayout>} />
      <Route path="/testimonials" element={<SiteLayout><Testimonials /></SiteLayout>} />
      <Route path="/courses" element={<SiteLayout><Courses /></SiteLayout>} />
      <Route path="/crack-company" element={<SiteLayout><CrackCompany /></SiteLayout>} />
      <Route path="/jobs" element={<SiteLayout><Jobs /></SiteLayout>} />
      <Route path="/course-tracks" element={<SiteLayout><CourseTracks /></SiteLayout>} />
      <Route path="/course-tracks/freshers" element={<SiteLayout><FresherCourses /></SiteLayout>} />
      <Route path="/course-tracks/experienced" element={<SiteLayout><ExperiencedCourses /></SiteLayout>} />
      <Route path="/open-mic" element={<SiteLayout><OpenMic /></SiteLayout>} />
      <Route path="/interview-simulator" element={<SiteLayout><InterviewSimulator /></SiteLayout>} />
      <Route path="/about" element={<SiteLayout><About /></SiteLayout>} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/interviews" element={<Interviews />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <Analytics />
    </>
  )
}
