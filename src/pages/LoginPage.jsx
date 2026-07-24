import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/login.css'
import { login } from '../api/auth'
import { clearSession, setSession } from '../auth/session'
import { setAccessToken } from '../api/client'
import { useToast } from '../components/ui/useToast'
import { images } from '../assets/images'
import { loginRedirect } from '../auth/msal'

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(String(value || ''))
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', bytes)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export default function LoginPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msalLoading, setMsalLoading] = useState(false)

  const handleEmailLogin = useCallback(async (e) => {
    e.preventDefault()
    if (!email || ! password) return
    setLoading(true)
    try {
      const passwordHash = await sha256Hex(password)
      const res = await login({ email, password: passwordHash })
      if (res.token && res.user) {
        setAccessToken(res.token)
        setSession(res.user, res.token, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
        toast.success(`Welcome back, ${res.user.name || res.user.email}`)
        navigate('/dashboard/overview', { replace: true })
      } else {
        toast.error('Invalid credentials')
      }
    } catch (err) {
      console.error('Login error:', err)
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }, [email, password, navigate, toast])

  const handleMsalLogin = useCallback(() => {
    setMsalLoading(true)
    try {
      // Store the intended redirect path
      sessionStorage.setItem('msalRedirectPath', '/dashboard/overview')
      // Initiate redirect flow
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

            {/* Microsoft Sign-In Button */}
            <button
              type="button"
              className="login-microsoft-button"
              onClick={handleMsalLogin}
              disabled={msalLoading || loading}
            >
              <svg className="microsoft-icon" viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
                <path
                  fill="currentColor"
                  d="M1.25 1.25h10.5v10.5H1.25V1.25zm11.25 0h10.5v10.5H12.5V1.25zM1.25 12.5h10.5V23H1.25V12.5zm11.25 0h10.5V23H12.5V12.5z"
                />
              </svg>
              <span>{msalLoading ? 'Redirecting...' : 'Sign in with Microsoft'}</span>
            </button>

            {/* Divider */}
            <div className="login-divider">
              <span>or</span>
            </div>

            {/* Email/Password Form (Legacy) */}
            <form className="login-form" onSubmit={handleEmailLogin}>
              <div className="login-field">
                <label className="login-label" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  disabled={loading || msalLoading}
                />
              </div>

              <div className="login-field">
                <label className="login-label" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading || msalLoading}
                />
              </div>

              <button
                type="submit"
                className="login-primary-button"
                disabled={loading || msalLoading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="login-hint">
              Use your Microsoft work account to sign in with SSO, or use your email and password.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}