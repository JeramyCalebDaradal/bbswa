import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { initializeMsal, restoreSession, addEventCallback, EventType } from '../auth/msal'
import { setSession, clearSession } from '../auth/session'

export default function MsalInitializer({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        // Initialize MSAL
        await initializeMsal()

        // Set up MSAL event listener for logout
        const removeCallback = addEventCallback((message) => {
          if (message.eventType === EventType.LOGOUT_SUCCESS) {
            console.log('[MsalInitializer] MSAL logout detected')
            clearSession()
            if (!cancelled && location.pathname !== '/login') {
              navigate('/login', { replace: true })
            }
          }
        })

        // Restore session from MSAL cache
        const account = await restoreSession()
        if (account) {
          // Account exists - session is restored
          const user = {
            id: account.localAccountId || account.homeAccountId,
            email: account.username,
            name: account.name || account.username,
            role: 'Default',
            oid: account.localAccountId,
            tid: account.tenantId,
          }
          setSession(user)
        }

        setReady(true)
      } catch (err) {
        console.error('[MsalInitializer] Initialization failed:', err)
        setReady(true)
      }
    }

    init()

    return () => {
      cancelled = true
    }
  }, [navigate, location.pathname])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return children
}