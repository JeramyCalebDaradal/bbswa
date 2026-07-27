import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMsalInstance, initializeMsal } from '../auth/msal'
import { setSession, clearSession } from '../auth/session'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    async function handleRedirect() {
      try {
        const instance = getMsalInstance()

        // MSAL v3 automatically handles redirect response after initialize
        const authResult = await instance.handleRedirectPromise()

        if (!authResult) {
          // No auth result from redirect - could be an error or just page load
          console.log('[AuthCallback] No auth result from redirect')
          navigate('/login')
          return
        }

        // Successful login - account is now cached in MSAL
        const account = authResult.account
        if (!account) {
          console.warn('[AuthCallback] No account in auth result')
          navigate('/login')
          return
        }

        // Set active account for token acquisition
        instance.setActiveAccount(account)

        // Get initial access token for session
        try {
          const tokenResponse = await instance.acquireTokenSilent({
            scopes: ['User.Read'],
            account,
          })
        } catch (tokenErr) {
          console.warn('[AuthCallback] Initial token acquisition failed:', tokenErr)
        }

        // Build user object from account info
        const user = {
          id: account.localAccountId || account.homeAccountId,
          email: account.username,
          name: account.name || account.username,
          role: 'Default', // Role is determined by backend based on app role assignments
          oid: account.localAccountId,
          tid: account.tenantId,
        }

        setSession(user)
        navigate('/dashboard')
      } catch (err) {
        console.error('[AuthCallback] Redirect handling failed:', err)
        setError(err.message || 'Authentication failed')
        clearSession()
        // Give user a moment to see the error before redirecting
        setTimeout(() => navigate('/login'), 3000)
      }
    }

    // Initialize MSAL and handle redirect
    initializeMsal().then(() => {
      handleRedirect()
    })
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4" />
        <p className="text-gray-600">Completing sign-in...</p>
        {error && (
          <p className="mt-2 text-red-600 text-sm">{error}</p>
        )}
      </div>
    </div>
  )
}