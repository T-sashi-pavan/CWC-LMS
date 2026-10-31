import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Roadmaps from './pages/Roadmaps.jsx'
import Interviews from './pages/Interviews.jsx'
import Jobs from './pages/Jobs.jsx'
import Testimonials from './pages/Testimonials.jsx'
import Pro from './pages/Pro.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
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
