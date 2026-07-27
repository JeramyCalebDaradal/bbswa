import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getMsalInstance, initializeMsal, restoreSession, getAccessToken } from '../auth/msal'
import { setSession } from '../auth/session'

// Module-level singleton so MSAL bootstrap runs exactly once across the app
// lifecycle, even under React StrictMode double-invocation or route changes.
let bootstrapPromise = null

function decodeJwtPayload(token) {
  try {
    const parts = String(token || '').split('.')
    if (parts.length < 2) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    return JSON.parse(window.atob(padded))
  } catch {
    return null
  }
}

async function resolveUserRole() {
  try {
    // Never trigger an interactive redirect during app bootstrap.
    // If silent token acquisition fails here, keep the user signed in and
    // fall back to Default until a real API call resolves/refreshes the token.
    const token = await getAccessToken(undefined, { interactive: false })
    if (!token) return 'Default'
    const payload = decodeJwtPayload(token)
    const roles = Array.isArray(payload?.roles) ? payload.roles : []
    return roles[0] || 'Default'
  } catch (err) {
    console.warn('[MsalInitializer] Failed to resolve app role from token silently:', err)
    return 'Default'
  }
}

async function bootstrapMsal() {
  if (bootstrapPromise) return bootstrapPromise

  bootstrapPromise = (async () => {
    await initializeMsal()
    const instance = getMsalInstance()

    let account = null
    let fromRedirect = false

    // MSAL requires handleRedirectPromise() to be called on every page load.
    // This clears the `interaction_in_progress` flag from sessionStorage and
    // returns the auth result if we just returned from a login redirect.
    try {
      const authResult = await instance.handleRedirectPromise()
      if (authResult && authResult.account) {
        account = authResult.account
        fromRedirect = true
      }
    } catch (redirectErr) {
      console.error('[MsalInitializer] handleRedirectPromise failed:', redirectErr)
    }

    // If not returning from a redirect, restore any cached account
    if (!account) {
      account = await restoreSession()
    }

    if (account) {
      instance.setActiveAccount(account)
    }

    return { account, fromRedirect }
  })()

  return bootstrapPromise
}

export default function MsalInitializer({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const { account, fromRedirect } = await bootstrapMsal()
        if (cancelled) return

        if (account) {
          const resolvedRole = await resolveUserRole()
          const user = {
            id: account.localAccountId || account.homeAccountId,
            email: account.username,
            name: account.name || account.username,
            role: resolvedRole,
            oid: account.localAccountId,
            tid: account.tenantId,
          }
          setSession(user)

          if (fromRedirect) {
            const target = sessionStorage.getItem('msalRedirectPath') || '/dashboard'
            sessionStorage.removeItem('msalRedirectPath')
            navigate(target, { replace: true })
          } else if (location.pathname === '/auth/callback') {
            // Already signed in; skip the callback holding page
            navigate('/dashboard', { replace: true })
          }
        } else if (location.pathname === '/auth/callback') {
          // Landed on the callback page with no redirect result and no account
          navigate('/login', { replace: true })
        }

        setReady(true)
      } catch (err) {
        console.error('[MsalInitializer] Initialization failed:', err)
        setReady(true)
      }
    })()

    return () => {
      cancelled = true
    }
    // Intentionally empty — bootstrap must run once for the app's lifetime.
    // Re-running on navigation causes duplicate event listeners and races.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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