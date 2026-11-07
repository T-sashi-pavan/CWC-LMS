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
import Pro from './pages/Pro.jsx'
import About from './pages/About.jsx'
import OpenMic from './pages/OpenMic.jsx'
import InterviewSimulator from './pages/InterviewSimulator.jsx'
import SiteLayout from './components/PublicLayout.jsx'
import { useAuth } from './context/AuthContext.jsx'

// "/" is the public storefront for visitors and the full dashboard once logged in.
function HomeGate() {
  const { user, loading } = useAuth()
  if (loading) return <div className="splash">Loading…</div>
  return user ? <AppLayout><Home /></AppLayout> : <Landing />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<HomeGate />} />
      <Route path="/roadmaps" element={<SiteLayout><Roadmaps /></SiteLayout>} />
      <Route path="/open-mic" element={<SiteLayout><OpenMic /></SiteLayout>} />
      <Route path="/interview-simulator" element={<SiteLayout><InterviewSimulator /></SiteLayout>} />
      <Route path="/about" element={<SiteLayout><About /></SiteLayout>} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/pro" element={<Pro />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
