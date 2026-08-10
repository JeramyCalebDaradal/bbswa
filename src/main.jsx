import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MaintenancePage from './pages/MaintenancePage.jsx'
import { apiRequest } from './api/client'

const MAINTENANCE_SESSION_KEY = 'bbs-maintenance-bypass'

function hasMaintenanceBypass() {
  const url = new URL(window.location.href)
  const maintenanceMode = url.searchParams.get('maintenance')

  if (maintenanceMode !== null) {
    url.searchParams.delete('maintenance')
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
  }

  if (maintenanceMode === 'on') {
    window.sessionStorage.removeItem(MAINTENANCE_SESSION_KEY)
    return false
  }

  if (maintenanceMode === 'off') {
    window.sessionStorage.setItem(MAINTENANCE_SESSION_KEY, 'true')
    return true
  }

  return window.sessionStorage.getItem(MAINTENANCE_SESSION_KEY) === 'true'
}

const root = createRoot(document.getElementById('root'))

async function bootstrap() {
  if (!hasMaintenanceBypass()) {
    root.render(
      <StrictMode>
        <MaintenancePage />
      </StrictMode>
    )
    return
  }

  let initialWebsiteSettings
  try {
    const res = await apiRequest('/settings')
    initialWebsiteSettings = res?.settings || null
  } catch (err) {
    initialWebsiteSettings = null
    void err
  }

  root.render(
    <StrictMode>
      <App initialWebsiteSettings={initialWebsiteSettings} />
    </StrictMode>
  )
}

bootstrap()
