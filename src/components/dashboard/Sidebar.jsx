import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  CalendarDays,
  Mail,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

export default function Sidebar({ activeSection, onSectionChange, isMobileOpen, setIsMobileOpen }) {
  const navigate = useNavigate()

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && isMobileOpen) {
        setIsMobileOpen(false)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isMobileOpen, setIsMobileOpen])

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'blog', label: 'Blog / Articles', icon: FileText },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
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

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSectionChange(item.id)
                if (window.innerWidth < 768) {
                  setIsMobileOpen(false)
                }
              }}
              className={`flex w-full items-center gap-3 px-6 py-3 transition-all ${
                isActive
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
            <span className="text-xs font-medium leading-none text-white">AD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-500">admin@blackbear.com</p>
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
