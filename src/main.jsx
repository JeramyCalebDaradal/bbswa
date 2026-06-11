import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { apiRequest } from './api/client'

async function bootstrap() {
  let initialWebsiteSettings
  try {
    const res = await apiRequest('/settings')
    initialWebsiteSettings = res?.settings || null
  } catch (err) {
    initialWebsiteSettings = null
    void err
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App initialWebsiteSettings={initialWebsiteSettings} />
    </StrictMode>
  )
}

bootstrap()
