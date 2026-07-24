import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  CalendarDays,
  Mail,
  BarChart3,
  ClipboardList,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react'
import { clearSession, readUser, subscribeAuthChange } from '../../auth/session'
import { roleAllowsDashboardSection } from '../../auth/session'
import { clearAccessToken, apiRequest } from '../../api/client'
import { useToast } from '../ui/useToast'

function getUserLastName(user) {
  if (!user || typeof user !== 'object') return ''
  if (typeof user.last_name === 'string' && user.last_name.trim()) {
    return user.last_name.trim()
  }
  const name = typeof user.name === 'string' ? user.name.trim() : ''
  if (!name) return ''
  const parts = name.split(/\s+/).filter(Boolean)
  return parts.length ? String(parts[parts.length - 1]).trim() : ''
}

function truncateWithEllipsis(value, maxLength) {
  const v = String(value || '')
  if (!v) return ''
  if (v.length <= maxLength) return v
  if (maxLength <= 3) return v.slice(0, maxLength)
  return `${v.slice(0, maxLength - 3)}...`
}

function getUserInitials(user) {
  const lastName = getUserLastName(user)
  if (lastName) {
    return String(lastName[0] || 'U').toUpperCase()
  }
  const email = typeof user?.email === 'string' ? user.email.trim() : ''
  return (email[0] || 'U').toUpperCase()
}

export default function Sidebar({ activeSection, onSectionChange, isMobileOpen, setIsMobileOpen }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [user, setUser] = useState(() => readUser())

  useEffect(() => {
    return subscribeAuthChange(() => setUser(readUser()))
  }, [])

  const displayName = useMemo(() => truncateWithEllipsis(getUserLastName(user) || 'User', 14), [user])
  const email = useMemo(() => {
    const emailRaw = typeof user?.email === 'string' && user.email.trim() ? user.email.trim() : ''
    return emailRaw ? truncateWithEllipsis(emailRaw, 14) : ''
  }, [user])
  const initials = useMemo(() => getUserInitials(user), [user])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && isMobileOpen) {
        setIsMobileOpen(false)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isMobileOpen, setIsMobileOpen])

  const handleLogout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' })
    } catch {
      // Silently ignore -- local session cleanup is sufficient
    }
    clearAccessToken()
    clearSession()
    navigate('/login')
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'content', label: 'Blog / Articles', icon: FileText },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'logging', label: 'Logging', icon: ClipboardList },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'role-config', label: 'Role Config', icon: ShieldCheck },
    { id: 'profile-settings', label: 'Profile settings', icon: User },
  ]

  const SidebarContent = ({ showClose }) => (
    <div className="flex h-full w-64 flex-col bg-[#1a1d2e]">
      <div className="flex items-center justify-between gap-3 border-b border-[#2a2d3e] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600">
            <span className="text-lg font-bold text-[#1a1d2e]">BB</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-white">Black Bear Securities</h1>
            <p className="text-xs text-gray-400">Admin Dashboard</p>
          </div>
        </div>

        {showClose ? (
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-gray-300 hover:bg-white/5 hover:text-white"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          const allowed = roleAllowsDashboardSection(user?.role, item.id)

          if (item.id === 'content') {
            const children = [
              { id: 'blog', label: 'Articles' },
              { id: 'datasheets', label: 'Datasheets' },
              { id: 'info-videos', label: 'Informational Video' },
            ]

            return (
              <section key={item.id} className="px-3">
                <div className="flex items-center gap-3 px-3 py-3 text-gray-400">
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="pb-2">
                  {children.map((child) => {
                    const childAllowed = roleAllowsDashboardSection(user?.role, child.id)
                    const childActive = activeSection === child.id
                    return (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => {
                          if (!childAllowed) {
                            toast.error("You don't have access to this page.")
                            return
                          }
                          onSectionChange(child.id)
                          if (window.innerWidth < 768) {
                            setIsMobileOpen(false)
                          }
                        }}
                        disabled={!childAllowed}
                        className={`flex w-full items-center gap-3 rounded-lg px-6 py-2 transition-all ${
                          !childAllowed
                            ? 'cursor-not-allowed text-gray-600 opacity-50'
                            : childActive
                            ? 'bg-white/5 text-amber-400'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="text-sm font-medium">{child.label}</span>
                      </button>
                    )
                  })}
                </div>
              </section>
            )
          }

          if (item.id === 'logging') {
            const children = [
              { id: 'logs', label: 'Action Logs' },
              { id: 'api-logs', label: 'API Logs' },
            ]

            return (
              <section key={item.id} className="px-3">
                <div className="flex items-center gap-3 px-3 py-3 text-gray-400">
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="pb-2">
                  {children.map((child) => {
                    const childAllowed = roleAllowsDashboardSection(user?.role, child.id)
                    const childActive = activeSection === child.id
                    return (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => {
                          if (!childAllowed) {
                            toast.error("You don't have access to this page.")
                            return
                          }
                          onSectionChange(child.id)
                          if (window.innerWidth < 768) {
                            setIsMobileOpen(false)
                          }
                        }}
                        disabled={!childAllowed}
                        className={`flex w-full items-center gap-3 rounded-lg px-6 py-2 transition-all ${
                          !childAllowed
                            ? 'cursor-not-allowed text-gray-600 opacity-50'
                            : childActive
                            ? 'bg-white/5 text-amber-400'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="text-sm font-medium">{child.label}</span>
                      </button>
                    )
                  })}
                </div>
              </section>
            )
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (!allowed) {
                  toast.error("You don't have access to this page.")
                  return
                }
                onSectionChange(item.id)
                if (window.innerWidth < 768) {
                  setIsMobileOpen(false)
                }
              }}
              disabled={!allowed}
              className={`flex w-full items-center gap-3 px-6 py-3 transition-all ${
                !allowed
                  ? 'cursor-not-allowed text-gray-600 opacity-50'
                  : isActive
                  ? 'border-l-4 border-amber-500 bg-gradient-to-r from-amber-500/20 to-transparent text-amber-400'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="border-t border-[#2a2d3e] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-700">
            <span className="text-xs font-medium leading-none text-white">{initials}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">{displayName}</p>
            {email ? <p className="text-xs text-gray-500">{email}</p> : null}
          </div>

          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-gray-300 hover:bg-white/5 hover:text-white"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside className="fixed left-0 top-0 hidden h-screen w-64 md:block">
        <SidebarContent />
      </aside>

      <button
        type="button"
        className="fixed left-4 top-4 z-40 inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#1a1d2e] p-2 text-white shadow md:hidden"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
          />
          <div className="relative h-full">
            <SidebarContent showClose />
          </div>
        </div>
      ) : null}
    </>
  )
}
