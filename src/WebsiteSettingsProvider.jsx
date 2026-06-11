import { useMemo, useState } from 'react'
import { WebsiteSettingsContext } from './websiteSettingsContext'

function normalizeWebsiteSettings(value) {
  const v = value && typeof value === 'object' ? value : {}
  return {
    company_name: String(v.company_name || '').trim() || 'Black Bear Securities',
    contact_email: String(v.contact_email || '').trim() || 'concierge@blackbearsecurities.com',
    contact_number: String(v.contact_number || '').trim() || '63286837594',
  }
}

export default function WebsiteSettingsProvider({ children, initialWebsiteSettings }) {
  const [websiteSettings, setWebsiteSettingsRaw] = useState(() => normalizeWebsiteSettings(initialWebsiteSettings))

  const value = useMemo(
    () => ({
      websiteSettings,
      setWebsiteSettings: (next) => setWebsiteSettingsRaw(normalizeWebsiteSettings(next)),
    }),
    [websiteSettings]
  )

  return <WebsiteSettingsContext.Provider value={value}>{children}</WebsiteSettingsContext.Provider>
}
