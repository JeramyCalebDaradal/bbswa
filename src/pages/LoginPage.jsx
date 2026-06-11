import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/login.css'
import { login } from '../api/auth'
import { clearSession, setSession } from '../auth/session'
import { useToast } from '../components/ui/useToast'
import { images } from '../assets/images'

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(String(value || ''))
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', bytes)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export default function LoginPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  const isValidUser = (user) => {
    return (
      user &&
      typeof user === 'object' &&
      typeof user.email === 'string' &&
      user.email.trim().length > 0 &&
      typeof user.role === 'string' &&
      user.role.trim().length > 0
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      clearSession()
      const passwordHash = await sha256Hex(formData.password)
      const res = await login({ email: formData.email, password: passwordHash })
      if (!isValidUser(res?.user)) {
        clearSession()
        toast.error('Login failed: invalid user data returned')
        return
      }
      const tokenEnc = String(res?.token || '').trim()
      const tokenExpiresAt = String(res?.token_expires_at || '').trim()
      if (!tokenEnc || !tokenExpiresAt) {
        clearSession()
        toast.error('Login failed: missing session token')
        return
      }

      setSession(res.user, tokenEnc, tokenExpiresAt)
      navigate('/dashboard/overview')
    } catch (err) {
      const message = err?.message || 'Invalid email or password'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-content">
            <div className="logo-section">
              <img src={images.logo} alt="Black Bear" className="login-logo" />
            </div>

            <h1 className="login-title">Welcome back</h1>
            <p className="login-subtitle">Sign in to your account to continue</p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label className="login-label" htmlFor="login-email">
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  required
                  disabled={isLoading}
                  className="login-input"
                  autoComplete="email"
                />
              </div>

              <div className="login-field">
                <label className="login-label" htmlFor="login-password">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="login-input"
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" disabled={isLoading} className="login-primary-button">
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
