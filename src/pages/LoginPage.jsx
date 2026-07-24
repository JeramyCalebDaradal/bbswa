import { useCallback, useState } from 'react'
import '../styles/login.css'
import { images } from '../assets/images'
import { loginRedirect } from '../auth/msal'
import { useToast } from '../components/ui/useToast'

export default function LoginPage() {
  const toast = useToast()
  const [msalLoading, setMsalLoading] = useState(false)

  const handleMsalLogin = useCallback(() => {
    setMsalLoading(true)
    try {
      sessionStorage.setItem('msalRedirectPath', '/dashboard/overview')
      loginRedirect()
    } catch (err) {
      console.error('MSAL login error:', err)
      toast.error('Failed to start Microsoft sign-in')
      setMsalLoading(false)
    }
  }, [toast])

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-content">
            <div className="logo-section">
              <img src={images.logo} alt="Black Bear" className="login-logo" />
            </div>

            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to access your dashboard</p>

            <button
              type="button"
              className="login-microsoft-button"
              onClick={handleMsalLogin}
              disabled={msalLoading}
            >
              <svg className="microsoft-icon" viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
                <path
                  fill="currentColor"
                  d="M1.25 1.25h10.5v10.5H1.25V1.25zm11.25 0h10.5v10.5H12.5V1.25zM1.25 12.5h10.5V23H1.25V12.5zm11.25 0h10.5V23H12.5V12.5z"
                />
              </svg>
              <span>{msalLoading ? 'Redirecting...' : 'Sign in with Microsoft'}</span>
            </button>

            <p className="login-hint">
              Use your Microsoft work account to sign in.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
