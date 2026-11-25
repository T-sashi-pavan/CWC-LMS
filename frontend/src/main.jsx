import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './styles/index.css'
import './styles/login.css'
import './styles/home.css'
import './styles/creative.css'
import './styles/showcase.css'
import './styles/roadmaps.css'
import './styles/courses.css'
import './styles/media.css'
import './styles/viewer.css'
import './styles/social.css'
import './styles/courses-nav.css'
import './styles/navdd.css'
import './styles/jobs.css'
import './styles/crack.css'

const umamiId = import.meta.env.VITE_UMAMI_WEBSITE_ID
if (umamiId && typeof document !== 'undefined') {
  const s = document.createElement('script')
  s.defer = true
  s.src = 'https://cloud.umami.is/script.js'
  s.dataset.websiteId = umamiId
  document.head.appendChild(s)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
