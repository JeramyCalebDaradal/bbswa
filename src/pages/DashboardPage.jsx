import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardOverview from '../components/dashboard/DashboardOverview'
import Appointments from '../components/dashboard/Appointments'
import Leads from '../components/dashboard/Leads'
import Blog from '../components/dashboard/Blog'
import Events from '../components/dashboard/Events'
import Newsletter from '../components/dashboard/Newsletter'
import Reports from '../components/dashboard/Reports'
import Settings from '../components/dashboard/Settings'

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
      case 'appointments':
        return <Appointments />
      case 'leads':
        return <Leads />
      case 'blog':
        return <Blog />
      case 'events':
        return <Events />
      case 'newsletter':
        return <Newsletter />
      case 'reports':
        return <Reports />
      case 'settings':
        return <Settings />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <main className="px-4 pb-10 pt-20 md:ml-64 md:px-8 md:pt-8">
        <section className="mx-auto w-full max-w-6xl">{renderContent()}</section>
      </main>
    </div>
  )
}
