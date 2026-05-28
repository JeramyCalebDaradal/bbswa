import { useState } from 'react'
import { Box, Card, TextField, Button, Typography, Avatar, Grid } from '@mui/material'
import { Person as PersonIcon } from '@mui/icons-material'
import '../styles/dashboard-content.css'

export default function ProfileSettings() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [formData, setFormData] = useState({
    fullName: user.name || 'Demo User',
    email: user.email || 'demo@example.com',
    phone: '+1 (555) 000-0000',
    company: 'Black Bear Securities',
    position: 'Administrator',
    bio: 'Welcome to your profile settings.',
  })
  const [isSaved, setIsSaved] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    localStorage.setItem('user', JSON.stringify({ ...user, name: formData.fullName }))
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <Box className="dashboard-section">
      <Box className="section-header">
        <Typography variant="h5" className="section-title">
          Profile Settings
        </Typography>
        <Typography className="section-subtitle">
          Manage your account information and preferences.
        </Typography>
      </Box>

      {/* Profile Header */}
      <Card className="profile-card">
        <Box className="profile-header">
          <Avatar className="profile-avatar">
            <PersonIcon />
          </Avatar>
          <Box className="profile-info">
            <Typography variant="h6" className="profile-name">
              {formData.fullName}
            </Typography>
            <Typography className="profile-email">
              {formData.email}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Save Status */}
      {isSaved && (
        <Box className="success-message">
          <Typography>Profile updated successfully!</Typography>
        </Box>
      )}

      {/* Edit Form */}
      <Card className="form-card">
        <Box className="form-section">
          <Typography variant="h6" className="form-section-title">
            Personal Information
          </Typography>

          <Grid container spacing={2} className="form-grid">
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>

        <Box className="form-section">
          <Typography variant="h6" className="form-section-title">
            Organization
          </Typography>

          <Grid container spacing={2} className="form-grid">
            <Grid item xs={12}>
              <TextField
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>

        <Box className="form-actions">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            className="save-button"
          >
            Save Changes
          </Button>
        </Box>
      </Card>
    </Box>
  )
}
