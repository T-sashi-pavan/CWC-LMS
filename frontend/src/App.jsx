import { Navigate, Route, Routes } from 'react-router-dom'
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
import Courses from './pages/Courses.jsx'
import SiteLayout from './components/PublicLayout.jsx'
import GreetingPopup from './components/GreetingPopup.jsx'
import { JobsNudge } from './components/JobsSpotlight.jsx'
import { useAuth } from './context/AuthContext.jsx'

// "/" is the public storefront for visitors and the full dashboard once logged in.
function HomeGate() {
  const { user, loading } = useAuth()
  if (loading) return <div className="splash">Loading…</div>
  return user ? <AppLayout><Home /></AppLayout> : <Landing />
}

export default function App() {
  return (
    <>
    <GreetingPopup />
    <JobsNudge />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<HomeGate />} />
      <Route path="/roadmaps" element={<SiteLayout><Roadmaps /></SiteLayout>} />
      <Route path="/roadmaps/:slug" element={<SiteLayout><RoadmapDetail /></SiteLayout>} />
      <Route path="/testimonials" element={<SiteLayout><Testimonials /></SiteLayout>} />
      <Route path="/courses" element={<SiteLayout><Courses /></SiteLayout>} />
      <Route path="/jobs" element={<SiteLayout><Jobs /></SiteLayout>} />
      <Route path="/course-tracks" element={<SiteLayout><CourseTracks /></SiteLayout>} />
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
    </>
  )
}
