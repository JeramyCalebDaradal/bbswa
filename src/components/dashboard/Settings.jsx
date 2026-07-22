import { Bell, Calendar, Eye, EyeOff, Globe, Save, Users as UsersIcon, X, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { createAdminUser, getAdminSettings, listRoles, listUsers, updateAdminSettings, updateAdminUser } from '../../api/admin'
import { readUser } from '../../auth/session'
import { useToast } from '../ui/useToast'
import { useWebsiteSettings } from '../../useWebsiteSettings'

function Toggle({ defaultChecked = false, checked, onChange, disabled = false }) {
  return (
    <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        className="peer sr-only"
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300" />
    </label>
  )
}

function SettingsCard({ icon: Icon, iconGradient, title, children }) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${iconGradient}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </section>
  )
}

export default function Settings() {
  const toast = useToast()
  const website = useWebsiteSettings()
  const currentUser = useMemo(() => readUser(), [])
  const isSuperAdmin = String(currentUser?.role || '') === 'Super Admin'
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false)
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState('')
  const [adminUsers, setAdminUsers] = useState([])
  const [isUsersLoading, setIsUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [statusActive, setStatusActive] = useState(true)
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordCopied, setPasswordCopied] = useState(false)
  const [roles, setRoles] = useState([])

  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [editRole, setEditRole] = useState('')
  const [editStatusActive, setEditStatusActive] = useState(true)
  const [isUpdatingUser, setIsUpdatingUser] = useState(false)
  const [editError, setEditError] = useState('')

  const [isSettingsLoading, setIsSettingsLoading] = useState(false)
  const [settingsError, setSettingsError] = useState('')
  const [isSavingSettings, setIsSavingSettings] = useState(false)

  const [companyName, setCompanyName] = useState(() => String(website?.websiteSettings?.company_name || '').trim())
  const [contactEmail, setContactEmail] = useState(() => String(website?.websiteSettings?.contact_email || '').trim())
  const [contactNumber, setContactNumber] = useState(() => String(website?.websiteSettings?.contact_number || '').trim())
  const [infoVideosEnabled, setInfoVideosEnabled] = useState(Boolean(website?.websiteSettings?.info_videos_enabled))

  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false)
  const [autoCreateLeadFromAppointment, setAutoCreateLeadFromAppointment] = useState(false)
  const [autoFollowupRemindersEnabled, setAutoFollowupRemindersEnabled] = useState(false)

  const fallbackRoles = useMemo(
    () => ['Content Manager', 'Sales Agent', 'Analyst', 'Event Coordinator', 'Basic User', 'System Admin'],
    []
  )

  const loadSettings = async () => {
    setSettingsError('')
    setIsSettingsLoading(true)
    try {
      const res = await getAdminSettings()
      const s = res?.settings
      if (!s || typeof s !== 'object') {
        throw new Error('Failed to load settings')
      }
      setCompanyName(String(s.company_name || '').trim())
      setContactEmail(String(s.contact_email || '').trim())
      setContactNumber(String(s.contact_number || '').trim())
      setInfoVideosEnabled(Boolean(s.info_videos_enabled))
      setEmailNotificationsEnabled(Boolean(s.email_notifications_enabled))
      setAutoCreateLeadFromAppointment(Boolean(s.auto_create_lead_from_appointment))
      setAutoFollowupRemindersEnabled(Boolean(s.auto_followup_reminders_enabled))
    } catch (err) {
      const message = err?.message || 'Failed to load settings'
      setSettingsError(message)
      toast.error(message)
    } finally {
      setIsSettingsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!isSuperAdmin) return
    setIsSavingSettings(true)
    try {
      const res = await updateAdminSettings({
        company_name: companyName,
        contact_email: contactEmail,
        contact_number: contactNumber,
        info_videos_enabled: infoVideosEnabled,
        auto_create_lead_from_appointment: autoCreateLeadFromAppointment,
      })
      const s = res?.settings
      if (s && typeof s === 'object') {
        setCompanyName(String(s.company_name || '').trim())
        setContactEmail(String(s.contact_email || '').trim())
        setContactNumber(String(s.contact_number || '').trim())
        setInfoVideosEnabled(Boolean(s.info_videos_enabled))
        setEmailNotificationsEnabled(Boolean(s.email_notifications_enabled))
        setAutoCreateLeadFromAppointment(Boolean(s.auto_create_lead_from_appointment))
        setAutoFollowupRemindersEnabled(Boolean(s.auto_followup_reminders_enabled))
        website?.setWebsiteSettings?.({
          company_name: String(s.company_name || '').trim(),
          contact_email: String(s.contact_email || '').trim(),
          contact_number: String(s.contact_number || '').trim(),
          info_videos_enabled: Boolean(s.info_videos_enabled),
        })
      }
      toast.success('Settings updated')
    } catch (err) {
      toast.error(err?.message || 'Failed to update settings')
    } finally {
      setIsSavingSettings(false)
    }
  }

  const refreshUsers = async () => {
    setUsersError('')
    setIsUsersLoading(true)
    try {
      const res = await listUsers()
      setAdminUsers(Array.isArray(res.users) ? res.users : [])
    } catch (err) {
      setUsersError(err?.message || 'Failed to load users')
      setAdminUsers([])
    } finally {
      setIsUsersLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (isSuperAdmin) {
        refreshUsers()
      }
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (isSuperAdmin) {
        loadSettings()
      }
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  const generatePassword = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const bytes = new Uint8Array(12)
    window.crypto.getRandomValues(bytes)
    let out = ''
    for (let i = 0; i < bytes.length; i += 1) {
      out += alphabet[bytes[i] % alphabet.length]
    }
    return out
  }

  const resetModal = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setRole('')
    setStatusActive(true)
    setPassword('')
    setPasswordVisible(false)
    setPasswordCopied(false)
    setCreateError('')
    setCreateSuccess('')
  }

  const handleOpenAddAdmin = () => {
    if (!isSuperAdmin) return
    resetModal()
    const nextPassword = generatePassword()
    setPassword(nextPassword)
    setIsAddAdminOpen(true)

    const load = async () => {
      try {
        const res = await listRoles()
        const nextRoles = Array.isArray(res.roles) && res.roles.length ? res.roles : fallbackRoles
        setRoles(nextRoles)
        setRole((prev) => prev || nextRoles[0] || '')
      } catch {
        setRoles(fallbackRoles)
        setRole((prev) => prev || fallbackRoles[0] || '')
      }
    }

    load()
  }

  const handleCloseAddAdmin = () => {
    setIsAddAdminOpen(false)
  }

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password)
      setPasswordCopied(true)
      setTimeout(() => setPasswordCopied(false), 1200)
    } catch {
      setPasswordCopied(false)
    }
  }

  const handleCreateAdmin = async () => {
    if (!isSuperAdmin) return
    setCreateError('')
    setCreateSuccess('')
    setIsCreatingAdmin(true)
    try {
      const res = await createAdminUser({
        firstName,
        lastName,
        email,
        role,
        status: statusActive ? 'active' : 'inactive',
        password,
      })
      setCreateSuccess(`Created ${res.user.email}`)
      toast.success('User created successfully.')
      refreshUsers()
      setIsAddAdminOpen(false)
    } catch (err) {
      const message = err?.message || 'Failed to create user'
      toast.error(message)
      setCreateError(message)
    } finally {
      setIsCreatingAdmin(false)
    }
  }

  const openEditUser = async (u) => {
    if (!isSuperAdmin) return
    setEditError('')
    setEditingUser(u)
    setEditRole(String(u?.role || ''))
    setEditStatusActive(String(u?.status || '').toLowerCase() === 'active')
    setIsEditUserOpen(true)

    if (!roles.length) {
      try {
        const res = await listRoles()
        const nextRoles = Array.isArray(res.roles) && res.roles.length ? res.roles : fallbackRoles
        setRoles(nextRoles)
      } catch {
        setRoles(fallbackRoles)
      }
    }
  }

  const closeEditUser = () => {
    setIsEditUserOpen(false)
    setEditingUser(null)
    setEditRole('')
    setEditStatusActive(true)
    setEditError('')
  }

  const handleUpdateUser = async () => {
    if (!isSuperAdmin) return
    if (!editingUser?.id) return
    setEditError('')
    setIsUpdatingUser(true)
    try {
      const res = await updateAdminUser(editingUser.id, {
        role: editRole,
        status: editStatusActive ? 'active' : 'inactive',
      })
      const updated = res?.user
      setAdminUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, ...updated } : u)))
      toast.success('User updated successfully.')
      closeEditUser()
    } catch (err) {
      const message = err?.message || 'Failed to update user'
      toast.error(message)
      setEditError(message)
    } finally {
      setIsUpdatingUser(false)
    }
  }

  return (
    <section className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
        <p className="mt-1 text-gray-600">Configure your dashboard and application settings</p>
      </section>

      <section className="space-y-6">
        <SettingsCard icon={Globe} iconGradient="from-amber-400 to-amber-600" title="Website Information">
          <section className="space-y-4">
            {settingsError ? (
              <section className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{settingsError}</section>
            ) : null}

            <section className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-white">
                    <td className="w-1/3 px-4 py-3 font-medium text-gray-700">Company Name</td>
                    <td className="px-4 py-3 text-gray-900">{companyName || '—'}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="w-1/3 px-4 py-3 font-medium text-gray-700">Email</td>
                    <td className="px-4 py-3 text-gray-900">{contactEmail || '—'}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="w-1/3 px-4 py-3 font-medium text-gray-700">Contact number</td>
                    <td className="px-4 py-3 text-gray-900">{contactNumber || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <section className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSettingsLoading || isSavingSettings}
                />
              </section>
              <section className="sm:col-span-1">
                <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSettingsLoading || isSavingSettings}
                />
              </section>
              <section className="sm:col-span-1">
                <label className="mb-2 block text-sm font-medium text-gray-700">Contact number</label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSettingsLoading || isSavingSettings}
                />
              </section>
            </section>
          </section>
        </SettingsCard>

        <SettingsCard icon={Eye} iconGradient="from-slate-500 to-slate-700" title="Website Features">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="font-medium text-gray-900">Informational Videos</p>
                <p className="text-sm text-gray-600">Show the Informational Videos tab on the Resources page</p>
              </div>
              <Toggle
                checked={infoVideosEnabled}
                onChange={(e) => setInfoVideosEnabled(Boolean(e.target.checked))}
                disabled={isSettingsLoading || isSavingSettings}
              />
            </div>
          </div>
        </SettingsCard>

        {isSuperAdmin ? (
          <SettingsCard icon={UsersIcon} iconGradient="from-blue-400 to-blue-600" title="Admin Users">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={refreshUsers}
                  disabled={isUsersLoading}
                >
                  {isUsersLoading ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  type="button"
                  className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 transition-colors hover:border-amber-500 hover:text-amber-600"
                  onClick={handleOpenAddAdmin}
                >
                  + Add Admin User
                </button>
              </div>

              {usersError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{usersError}</div>
              ) : null}

              {adminUsers.length ? (
                <div className="space-y-2">
                  {adminUsers.map((u) => {
                    const fullName = `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'User'
                    const initials = `${(u.first_name || 'U')[0] || 'U'}${(u.last_name || '')[0] || ''}`.toUpperCase()
                    const statusLabel = String(u.status || '').toLowerCase() === 'active' ? 'Active' : 'Inactive'
                    const statusClass =
                      statusLabel === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    const canEditUser = String(u.role || '') !== 'Super Admin'

                    return (
                      <div key={u.id} className="flex items-center justify-between gap-4 rounded-lg bg-gray-50 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-700">
                            <span className="text-sm font-medium text-white">{initials}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{fullName}</p>
                            <p className="text-sm text-gray-600">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">{u.role}</span>
                          <span className={`rounded-full px-3 py-1 text-xs ${statusClass}`}>{statusLabel}</span>
                          <button
                            type="button"
                            className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={() => openEditUser(u)}
                            disabled={!canEditUser}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  No users found.
                </div>
              )}
            </div>
          </SettingsCard>
        ) : null}

        <SettingsCard icon={Bell} iconGradient="from-green-400 to-green-600" title="Email Notification Settings">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="font-medium text-gray-900">New Appointment Notifications</p>
                <p className="text-sm text-gray-600">Receive emails when new appointments are booked</p>
              </div>
              <Toggle checked={emailNotificationsEnabled} disabled />
            </div>
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="font-medium text-gray-900">New Lead Notifications</p>
                <p className="text-sm text-gray-600">Get notified about new leads</p>
              </div>
              <Toggle checked={emailNotificationsEnabled} disabled />
            </div>
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="font-medium text-gray-900">Newsletter Subscription Notifications</p>
                <p className="text-sm text-gray-600">Alert on new newsletter subscribers</p>
              </div>
              <Toggle checked={emailNotificationsEnabled} disabled />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard icon={Calendar} iconGradient="from-purple-400 to-purple-600" title="Booking Settings">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Default Appointment Duration (minutes)</label>
              <input
                type="number"
                defaultValue="60"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Business Hours</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  defaultValue="09:00"
                  className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="time"
                  defaultValue="17:00"
                  className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="font-medium text-gray-900">Allow Weekend Bookings</p>
                <p className="text-sm text-gray-600">Enable appointments on Saturdays and Sundays</p>
              </div>
              <Toggle />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard icon={Zap} iconGradient="from-red-400 to-red-600" title="Lead Automation Settings">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="font-medium text-gray-900">Auto-create Lead from Appointment</p>
                <p className="text-sm text-gray-600">Automatically create a lead when a user books an appointment</p>
              </div>
              <Toggle
                checked={autoCreateLeadFromAppointment}
                onChange={(e) => setAutoCreateLeadFromAppointment(Boolean(e.target.checked))}
                disabled={isSettingsLoading || isSavingSettings}
              />
            </div>
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="font-medium text-gray-900">Auto Follow-up Reminders</p>
                <p className="text-sm text-gray-600">Send automatic follow-up reminders for leads</p>
              </div>
              <Toggle checked={autoFollowupRemindersEnabled} disabled />
            </div>
          </div>
        </SettingsCard>

        <div className="flex justify-end">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-white shadow-sm transition-all hover:from-amber-600 hover:to-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleSaveSettings}
            disabled={isSettingsLoading || isSavingSettings}
          >
            <Save className="h-5 w-5" />
            {isSavingSettings ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </section>

      {isAddAdminOpen ? (
        <section className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseAddAdmin}
            aria-label="Close modal"
          />
          <section className="relative w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
            <section className="flex items-start justify-between gap-4">
              <section>
                <h3 className="text-xl font-semibold text-gray-900">Add Admin User</h3>
                <p className="mt-1 text-sm text-gray-600">Create a new dashboard user with a role and status.</p>
              </section>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={handleCloseAddAdmin}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <section className="sm:col-span-1">
                <label className="mb-2 block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={isCreatingAdmin}
                />
              </section>
              <section className="sm:col-span-1">
                <label className="mb-2 block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={isCreatingAdmin}
                />
              </section>
              <section className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={isCreatingAdmin}
                />
              </section>
              <section className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={isCreatingAdmin}
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </section>
              <section className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
                <section className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-amber-500"
                    onClick={copyPassword}
                    disabled={isCreatingAdmin}
                  >
                    <span className="font-mono text-sm text-gray-900">
                      {passwordVisible ? password : '••••••••••••'}
                    </span>
                    <span className="ml-3 text-xs text-gray-500">{passwordCopied ? 'Copied' : 'Click to copy'}</span>
                  </button>
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                    onClick={() => setPasswordVisible((v) => !v)}
                    disabled={isCreatingAdmin}
                    aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                  >
                    {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </section>
              </section>
              <section className="sm:col-span-2">
                <section className="flex items-center justify-between gap-6 rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <section>
                    <p className="font-medium text-gray-900">Status</p>
                    <p className="text-sm text-gray-600">{statusActive ? 'Active' : 'Inactive'}</p>
                  </section>
                  <Toggle checked={statusActive} onChange={(e) => setStatusActive(e.target.checked)} />
                </section>
              </section>
            </section>

            {createError ? (
              <section className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {createError}
              </section>
            ) : null}
            {createSuccess ? (
              <section className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {createSuccess}
              </section>
            ) : null}

            <section className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={handleCloseAddAdmin}
                disabled={isCreatingAdmin}
              >
                Cancel
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 font-medium text-white shadow-sm transition-all hover:from-amber-600 hover:to-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleCreateAdmin}
                disabled={isCreatingAdmin}
              >
                {isCreatingAdmin ? 'Creating...' : 'Create User'}
              </button>
            </section>
          </section>
        </section>
      ) : null}

      {isEditUserOpen ? (
        <section className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-black/50" onClick={closeEditUser} aria-label="Close modal" />
          <section className="relative w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
            <section className="flex items-start justify-between gap-4">
              <section>
                <h3 className="text-xl font-semibold text-gray-900">Edit User</h3>
                <p className="mt-1 text-sm text-gray-600">Update role and status for this user.</p>
              </section>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={closeEditUser}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </section>

            <section className="mt-6 space-y-4">
              <section className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-900">
                  {`${editingUser?.first_name || ''} ${editingUser?.last_name || ''}`.trim() || 'User'}
                </p>
                <p className="text-sm text-gray-600">{editingUser?.email}</p>
              </section>

              <section>
                <label className="mb-2 block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={isUpdatingUser}
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </section>

              <section>
                <section className="flex items-center justify-between gap-6 rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <section>
                    <p className="font-medium text-gray-900">Status</p>
                    <p className="text-sm text-gray-600">{editStatusActive ? 'Active' : 'Inactive'}</p>
                  </section>
                  <Toggle checked={editStatusActive} onChange={(e) => setEditStatusActive(e.target.checked)} />
                </section>
              </section>
            </section>

            {editError ? (
              <section className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {editError}
              </section>
            ) : null}

            <section className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={closeEditUser}
                disabled={isUpdatingUser}
              >
                Cancel
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 font-medium text-white shadow-sm transition-all hover:from-amber-600 hover:to-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleUpdateUser}
                disabled={isUpdatingUser}
              >
                {isUpdatingUser ? 'Saving...' : 'Save Changes'}
              </button>
            </section>
          </section>
        </section>
      ) : null}
    </section>
  )
}
