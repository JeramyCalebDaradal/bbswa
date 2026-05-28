import { ThemeProvider, CssBaseline } from '@mui/material'
import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import theme from './theme/theme'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import AboutPage from './pages/AboutPage'
import PartnersPage from './pages/PartnersPage'
import UnderConstructionPage from './pages/UnderConstructionPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import { useLocation } from 'react-router-dom'

function isEditableTarget(target) {
  return target instanceof HTMLElement && Boolean(target.closest('input, textarea, [contenteditable="true"]'))
}

function ContentProtection() {
  useEffect(() => {
    const onCopyCut = (event) => {
      if (isEditableTarget(event.target)) {
        return
      }
      event.preventDefault()
    }

    const onKeyDown = (event) => {
      const modifier = event.ctrlKey || event.metaKey
      if (!modifier) {
        return
      }
      const key = event.key.toLowerCase()
      if ((key === 'c' || key === 'x') && !isEditableTarget(event.target)) {
        event.preventDefault()
      }
    }

    const onContextMenu = (event) => {
      if (event.target instanceof Element && event.target.closest('img')) {
        event.preventDefault()
      }
    }

    const onDragStart = (event) => {
      if (event.target instanceof Element && event.target.closest('img')) {
        event.preventDefault()
      }
    }

    document.addEventListener('copy', onCopyCut)
    document.addEventListener('cut', onCopyCut)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('dragstart', onDragStart)

    return () => {
      document.removeEventListener('copy', onCopyCut)
      document.removeEventListener('cut', onCopyCut)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('dragstart', onDragStart)
    }
  }, [])

  return null
}

function ScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const id = location.hash.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }, [location.pathname, location.hash])

  return null
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ContentProtection />
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/resources" element={<UnderConstructionPage title="Resources" />} />
          <Route path="/events" element={<UnderConstructionPage title="Events" />} />
          <Route path="/career" element={<UnderConstructionPage title="Career" />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
