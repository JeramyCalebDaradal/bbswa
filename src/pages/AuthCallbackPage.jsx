import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { EventType } from '@azure/msal-browser'
import { initializeMsal, getAccessToken, getAccount, addEventCallback } from '../auth/msal'
import { setAccessToken } from '../api/client'
import { setSession } from '../auth/session'
import { entraMe } from '../api/auth'
import { useToast } from '../components/ui/useToast'
import { Box, CircularProgress, Typography, Alert } from '@mui/material'

function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const toast = useToast()
  const [status, setStatus] = useState('initializing')
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    const handleAuth = async () => {
      try {
        setStatus('initializing')
        
        // Initialize MSAL and handle redirect
        const initialized = await initializeMsal()
        if (!mounted) return
        
        if (!initialized) {
          setStatus('error')
          setError('Failed to initialize authentication')
          return
        }

        setStatus('processing')

        // Check if we got a valid account from redirect
        const account = getAccount()
        if (!account) {
          // Check for MSAL errors in URL
          const msalError = searchParams.get('error')
          const msalErrorDescription = searchParams.get('error_description')
          
          if (msalError) {
            setStatus('error')
            setError(`${msalError}: ${msalErrorDescription || 'Authentication failed'}`)
            return
          }
          
          setStatus('error')
          setError('Authentication cancelled or failed')
          return
        }

        // Get the Entra access token from MSAL
        let entraToken
        try {
          entraToken = await getAccessToken()
        } catch (tokenError) {
          console.error('[AuthCallback] Token acquisition failed:', tokenError)
          if (!mounted) return
          setStatus('error')
          setError('Failed to acquire access token')
          return
        }

        if (!mounted) return

        // Store the Entra token for API calls
        setAccessToken(entraToken)

        // Verify token with backend and get user info + role
        let userData
        try {
          userData = await entraMe(entraToken)
        } catch (backendError) {
          console.error('[AuthCallback] Backend verification failed:', backendError)
          if (!mounted) return
          setStatus('error')
          setError(backendError.message || 'Failed to verify sign-in with server')
          return
        }

        if (!mounted) return

        // Store user info in session
        const user = {
          id: userData.user?.id || account.homeAccountId,
          email: userData.user?.email || account.username,
          name: userData.user?.name || account.name || account.username,
          role: userData.user?.role || 'Default',
          oid: userData.user?.oid || account.idTokenClaims?.oid || account.idTokenClaims?.sub,
          tid: userData.user?.tid || account.idTokenClaims?.tid,
        }

        setSession(user, entraToken, new Date(Date.now() + 3600000).toISOString())

        if (!mounted) return
        setStatus('success')
      } catch (err) {
        console.error('[AuthCallback] Error:', err)
        if (!mounted) return
        setStatus('error')
        setError(err.message || 'Authentication failed')
      }
    }

    // Listen for MSAL events
    const unsubscribe = addEventCallback((message) => {
      if (message.eventType === EventType.LOGIN_SUCCESS) {
        console.log('[AuthCallback] Login success:', message)
      } else if (message.eventType === EventType.LOGIN_FAILURE) {
        console.error('[AuthCallback] Login failure:', message)
      }
    })

    handleAuth()

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [searchParams, navigate])

  // On success, redirect to dashboard
  useEffect(() => {
    if (status === 'success') {
      const redirectPath = sessionStorage.getItem('msalRedirectPath') || '/dashboard/overview'
      sessionStorage.removeItem('msalRedirectPath')
      navigate(redirectPath, { replace: true })
    }
  }, [status, navigate])

  if (status === 'initializing') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="body1" color="text.secondary">Initializing authentication...</Typography>
      </Box>
    )
  }

  if (status === 'processing') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="body1" color="text.secondary">Completing sign in...</Typography>
      </Box>
    )
  }

  if (status === 'error') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', px: 3 }}>
        <Box sx={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Sign In Failed</Typography>
            <Typography variant="body1">{error || 'An unknown error occurred'}</Typography>
          </Alert>
          <Typography variant="body2" color="text.secondary" paragraph>
            Redirecting to login page...
          </Typography>
          <button
            onClick={() => window.location.assign('/login')}
            style={{
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#fff',
              background: '#ff6900',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Back to Login
          </button>
        </Box>
      </Box>
    )
  }

  return null
}

export default AuthCallback