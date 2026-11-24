import { Navigate } from 'react-router-dom'

// Smart redirect: sends visitors to their saved track, or defaults to Freshers with zero friction.
export default function CourseTracks() {
  let track = 'freshers'
  try {
    if (localStorage.getItem('cwc_track') === 'experienced') track = 'experienced'
  } catch { /* ignore storage errors */ }
  return <Navigate to={`/course-tracks/${track}`} replace />
}
