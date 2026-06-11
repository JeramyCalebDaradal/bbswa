import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import { clearSession, isAuthenticated, readToken, readTokenExpiresAt, readUser, setSession } from '../auth/session'
import { roleAllowsDashboardSection } from '../auth/session'
import { useToast } from '../components/ui/useToast'
import { me } from '../api/auth'

export default function DashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    let alive = true
    const run = async () => {
      const authed = isAuthenticated()
      if (!authed) {
        clearSession()
        navigate('/login', { replace: true })
        return
      }

      const user = readUser()
      const hasValidUser = user && typeof user === 'object' && typeof user.role === 'string' && user.role.trim().length > 0
      if (hasValidUser) return

      try {
        const res = await me()
        const token = readToken()
        const tokenExpiresAt = readTokenExpiresAt()
        if (res?.user && token && tokenExpiresAt) {
          setSession(res.user, token, tokenExpiresAt)
          return
        }
        throw new Error('Unauthorized')
      } catch {
        clearSession()
        navigate('/login', { replace: true })
      }
    }

    run().finally(() => {
      if (!alive) return
      setIsBootstrapping(false)
    })

    return () => {
      alive = false
    }
  }, [navigate])

  const activeSection = useMemo(() => {
    const segment = location.pathname.split('/')[2]
    return segment || 'overview'
  }, [location.pathname])

  useEffect(() => {
    const user = readUser()
    if (!user || typeof user !== 'object') return
    if (activeSection === 'overview') return
    const allowed = roleAllowsDashboardSection(user?.role, activeSection)
    if (!allowed) {
      toast.error("You don't have access to this page.")
      navigate('/dashboard/overview', { replace: true })
    }
  }, [activeSection, navigate, toast])

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-gray-50" data-deterrence="off">
        <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6">
          <section className="rounded-xl border border-gray-200 bg-white px-6 py-4 text-sm text-gray-600 shadow-sm">
            Loading dashboard...
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" data-deterrence="off">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={(sectionId) => navigate(`/dashboard/${sectionId}`)}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <main className="px-4 pb-10 pt-20 md:ml-64 md:px-8 md:pt-8">
        <section className="mx-auto w-full max-w-6xl">
          <Outlet />
        </section>
      </main>
    </div>
  )
}
