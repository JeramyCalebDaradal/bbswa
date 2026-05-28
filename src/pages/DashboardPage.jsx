import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardOverview from '../components/dashboard/DashboardOverview'
import ProfileSettings from '../components/dashboard/ProfileSettings'
import BlogPosts from '../components/dashboard/BlogPosts'
import BlogTags from '../components/dashboard/BlogTags'
import BlogCategories from '../components/dashboard/BlogCategories'
import '../styles/dashboard.css'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('overview')
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [navigate])

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />
      case 'profile':
        return <ProfileSettings />
      case 'blog-posts':
        return <BlogPosts />
      case 'blog-tags':
        return <BlogTags />
      case 'blog-categories':
        return <BlogCategories />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <Box className="dashboard-layout">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <main className="dashboard-main">
        <Container maxWidth="lg" className="dashboard-container">
          {renderContent()}
        </Container>
      </main>
    </Box>
  )
}
