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
