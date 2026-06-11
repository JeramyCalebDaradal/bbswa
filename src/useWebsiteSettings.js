import { useContext } from 'react'
import { WebsiteSettingsContext } from './websiteSettingsContext'

export function useWebsiteSettings() {
  const ctx = useContext(WebsiteSettingsContext)
  if (!ctx) {
    throw new Error('useWebsiteSettings must be used within WebsiteSettingsProvider')
  }
  return ctx
}
