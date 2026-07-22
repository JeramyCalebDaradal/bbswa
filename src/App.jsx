import { ThemeProvider, CssBaseline } from '@mui/material'
import { useEffect, useRef } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import theme from './theme/theme'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import AboutPage from './pages/AboutPage'
import PartnersPage from './pages/PartnersPage'
import ResourcesPage from './pages/ResourcesPage'
import EventsPage from './pages/EventsPage'
import ArticlePage from './pages/ArticlePage'
import CareerPage from './pages/CareerPage'
import UnderConstructionPage from './pages/UnderConstructionPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import DashboardOverviewPage from './pages/DashboardPages/DashboardOverviewPage'
import DashboardAppointmentsPage from './pages/DashboardPages/DashboardAppointmentsPage'
import DashboardLeadsPage from './pages/DashboardPages/DashboardLeadsPage'
import DashboardBlogPage from './pages/DashboardPages/DashboardBlogPage'
import DashboardDatasheetsPage from './pages/DashboardPages/DashboardDatasheetsPage'
import DashboardInfoVideosPage from './pages/DashboardPages/DashboardInfoVideosPage'
import DashboardEventsPage from './pages/DashboardPages/DashboardEventsPage'
import DashboardNewsletterPage from './pages/DashboardPages/DashboardNewsletterPage'
import DashboardReportsPage from './pages/DashboardPages/DashboardReportsPage'
import DashboardSettingsPage from './pages/DashboardPages/DashboardSettingsPage'
import DashboardProfileSettingsPage from './pages/DashboardPages/DashboardProfileSettingsPage'
import DashboardLogsPage from './pages/DashboardPages/DashboardLogsPage'
import DashboardApiLogsPage from './pages/DashboardPages/DashboardApiLogsPage'
import { useLocation } from 'react-router-dom'
import ToastProvider from './components/ui/ToastProvider'
import WebsiteSettingsProvider from './WebsiteSettingsProvider'

function isEditableTarget(target) {
  return target instanceof HTMLElement && Boolean(target.closest('input, textarea, [contenteditable="true"]'))
}

function isDeterrenceDisabledTarget(target) {
  return target instanceof Element && Boolean(target.closest('[data-deterrence="off"]'))
}

function isDashboardPath(pathname) {
  return pathname === '/dashboard' || pathname.startsWith('/dashboard/')
}

function DeterrenceMode() {
  const location = useLocation()

  useEffect(() => {
    const enabled = !isDashboardPath(location.pathname)
    document.body.dataset.deterrence = enabled ? 'on' : 'off'
    return () => {
      delete document.body.dataset.deterrence
    }
  }, [location.pathname])

  return null
}

function ContentProtection() {
  const location = useLocation()
  const enabled = !isDashboardPath(location.pathname)
  const enabledRef = useRef(enabled)

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  useEffect(() => {
    const onCopyCut = (event) => {
      if (!enabledRef.current) {
        return
      }
      if (isDeterrenceDisabledTarget(event.target) || isDeterrenceDisabledTarget(document.activeElement)) {
        return
      }
      if (isEditableTarget(event.target)) {
        return
      }
      event.preventDefault()
    }

    const onKeyDown = (event) => {
      if (!enabledRef.current) {
        return
      }
      if (isDeterrenceDisabledTarget(event.target) || isDeterrenceDisabledTarget(document.activeElement)) {
        return
      }
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
      if (!enabledRef.current) {
        return
      }
      if (isDeterrenceDisabledTarget(event.target) || isDeterrenceDisabledTarget(document.activeElement)) {
        return
      }
      if (event.target instanceof Element && event.target.closest('img')) {
        event.preventDefault()
      }
    }

    const onDragStart = (event) => {
      if (!enabledRef.current) {
        return
      }
      if (isDeterrenceDisabledTarget(event.target) || isDeterrenceDisabledTarget(document.activeElement)) {
        return
      }
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

function App({ initialWebsiteSettings }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WebsiteSettingsProvider initialWebsiteSettings={initialWebsiteSettings}>
        <BrowserRouter>
          <ToastProvider>
            <DeterrenceMode />
            <ContentProtection />
            <ScrollToHash />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/resources/articles/:slug" element={<ArticlePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/career" element={<CareerPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<DashboardOverviewPage />} />
                <Route path="appointments" element={<DashboardAppointmentsPage />} />
                <Route path="leads" element={<DashboardLeadsPage />} />
                <Route path="blog" element={<DashboardBlogPage />} />
                <Route path="datasheets" element={<DashboardDatasheetsPage />} />
                <Route path="info-videos" element={<DashboardInfoVideosPage />} />
                <Route path="events" element={<DashboardEventsPage />} />
                <Route path="newsletter" element={<DashboardNewsletterPage />} />
                <Route path="reports" element={<DashboardReportsPage />} />
                <Route path="logs" element={<DashboardLogsPage />} />
                <Route path="api-logs" element={<DashboardApiLogsPage />} />
                <Route path="settings" element={<DashboardSettingsPage />} />
                <Route path="profile-settings" element={<DashboardProfileSettingsPage />} />
                <Route path="*" element={<Navigate to="overview" replace />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </BrowserRouter>
      </WebsiteSettingsProvider>
    </ThemeProvider>
  )
}

export default App
