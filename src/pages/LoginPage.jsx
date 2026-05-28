import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Box, Typography, Card, Alert } from '@mui/material'
import '../styles/login.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Demo credentials
  const DEMO_EMAIL = 'demo@example.com'
  const DEMO_PASSWORD = 'Demo@123'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (formData.email === DEMO_EMAIL && formData.password === DEMO_PASSWORD) {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('user', JSON.stringify({ email: formData.email, name: 'Demo User' }))
        navigate('/dashboard')
      } else {
        setError('Invalid email or password. Try demo@example.com / Demo@123')
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <Card className="login-card">
          <Box className="login-content">
            <Box className="logo-section">
              <Typography variant="h4" className="logo-text">
                Black Bear
              </Typography>
              <Typography variant="body2" className="logo-subtitle">
                Securities Dashboard
              </Typography>
            </Box>

            <Typography variant="h5" className="login-title">
              Welcome Back
            </Typography>

            <Typography variant="body2" className="login-subtitle">
              Sign in to your account
            </Typography>

            {error && <Alert severity="error" className="login-error">{error}</Alert>}

            <form onSubmit={handleSubmit} className="login-form">
              <TextField
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="demo@example.com"
                required
                fullWidth
                disabled={isLoading}
              />

              <TextField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                fullWidth
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isLoading}
                className="login-button"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <Box className="demo-credentials">
              <Typography variant="caption" className="demo-label">
                Demo Credentials
              </Typography>
              <Typography variant="caption" className="demo-text">
                Email: demo@example.com
              </Typography>
              <Typography variant="caption" className="demo-text">
                Password: Demo@123
              </Typography>
            </Box>
          </Box>
        </Card>
      </div>
    </div>
  )
}
