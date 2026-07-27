import { useMemo, useState } from 'react'
import { Eye, EyeOff, KeyRound, Save } from 'lucide-react'
import { readUser, setSession } from '../../auth/session'
import { changePassword, updateProfile } from '../../api/auth'

function initialsFromUser(user) {
  const first = typeof user?.first_name === 'string' ? user.first_name.trim() : ''
  const last = typeof user?.last_name === 'string' ? user.last_name.trim() : ''
  const a = first ? first[0] : ''
  const b = last ? last[0] : ''
  const v = `${a}${b}`.trim()
  if (v) return v.toUpperCase()
  const email = typeof user?.email === 'string' ? user.email.trim() : ''
  return (email[0] || 'U').toUpperCase()
}

export default function ProfileSettings() {
  const user = readUser() || {}
  const userId = user?.id

  const [firstName, setFirstName] = useState(user.first_name || '')
  const [lastName, setLastName] = useState(user.last_name || '')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)

  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const email = useMemo(() => (typeof user?.email === 'string' ? user.email.trim() : ''), [user])
  const role = useMemo(() => (typeof user?.role === 'string' ? user.role.trim() : ''), [user])
  const initials = useMemo(() => initialsFromUser(user), [user])

  const handleSaveProfile = async () => {
    setError('')
    setSuccess('')
    if (!userId || !email) {
      setError('Missing logged-in user')
      return
    }

    setIsSavingProfile(true)
    try {
      const res = await updateProfile({
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
      })

      if (res?.user) {
        setSession({ ...user, ...res.user })
      }

      setSuccess('Profile updated successfully.')
    } catch (err) {
      setError(err?.message || 'Failed to update profile')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleSavePassword = async () => {
    setError('')
    setSuccess('')
    if (!userId || !email) {
      setError('Missing logged-in user')
      return
    }
    if (!currentPassword.trim() || !newPassword.trim() || !repeatPassword.trim()) {
      setError('All password fields are required')
      return
    }
    if (newPassword !== repeatPassword) {
      setError('New passwords do not match')
      return
    }

    setIsSavingPassword(true)
    try {
      await changePassword({
        id: userId,
        email,
        current_password: currentPassword,
        new_password: newPassword,
      })

      setCurrentPassword('')
      setNewPassword('')
      setRepeatPassword('')
      setIsChangingPassword(false)
      setSuccess('Password updated successfully.')
    } catch (err) {
      setError(err?.message || 'Failed to update password')
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <section className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold text-gray-900">Profile settings</h2>
        <p className="mt-1 text-gray-600">Update your personal information and security settings.</p>
      </section>

      {error ? (
        <section className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</section>
      ) : null}
      {success ? (
        <section className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">{success}</section>
      ) : null}

      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <section className="flex items-center gap-4">
            <section className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-lg font-semibold text-white">
              {initials}
            </section>
            <section>
              <p className="text-lg font-semibold text-gray-900">
                {[firstName, lastName].map((v) => String(v || '').trim()).filter(Boolean).join(' ') || 'User'}
              </p>
              <p className="text-sm text-gray-600">{email || 'No email'}</p>
            </section>
          </section>

          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-amber-600 hover:to-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleSaveProfile}
            disabled={isSavingProfile || isSavingPassword}
          >
            <Save className="h-4 w-4" />
            {isSavingProfile ? 'Saving...' : 'Save changes'}
          </button>
        </section>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Account</h3>

          <section className="mt-5 grid grid-cols-1 gap-4">
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <section>
                <label className="mb-2 block text-sm font-medium text-gray-700">First name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={isSavingProfile || isSavingPassword}
                />
              </section>
              <section>
                <label className="mb-2 block text-sm font-medium text-gray-700">Last name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={isSavingProfile || isSavingPassword}
                />
              </section>
            </section>

            <section>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700"
              />
            </section>

            <section>
              <label className="mb-2 block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                value={role}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700"
              />
            </section>
          </section>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Security</h3>

          <section className="mt-5 space-y-4">
            {!isChangingPassword ? (
              <>
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => {
                    setError('')
                    setSuccess('')
                    setIsChangingPassword(true)
                  }}
                  disabled={isSavingProfile || isSavingPassword}
                >
                  <KeyRound className="h-4 w-4" />
                  Change password
                </button>
              </>
            ) : (
              <section className="space-y-4">
                <section>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Current password</label>
                  <section className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      disabled={isSavingPassword || isSavingProfile}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      onClick={() => setShowCurrentPassword((v) => !v)}
                      aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </section>
                </section>

                <section>
                  <label className="mb-2 block text-sm font-medium text-gray-700">New password</label>
                  <section className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      disabled={isSavingPassword || isSavingProfile}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      onClick={() => setShowNewPassword((v) => !v)}
                      aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </section>
                </section>

                <section>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Re-enter password</label>
                  <section className="relative">
                    <input
                      type={showRepeatPassword ? 'text' : 'password'}
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      disabled={isSavingPassword || isSavingProfile}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      onClick={() => setShowRepeatPassword((v) => !v)}
                      aria-label={showRepeatPassword ? 'Hide repeated password' : 'Show repeated password'}
                    >
                      {showRepeatPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </section>
                </section>

                <section className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => {
                      setIsChangingPassword(false)
                      setCurrentPassword('')
                      setNewPassword('')
                      setRepeatPassword('')
                      setError('')
                      setSuccess('')
                    }}
                    disabled={isSavingPassword}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-amber-600 hover:to-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleSavePassword}
                    disabled={isSavingPassword}
                  >
                    <Save className="h-4 w-4" />
                    {isSavingPassword ? 'Saving...' : 'Save'}
                  </button>
                </section>
              </section>
            )}

            <section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Enable OAuth</p>
                  <p className="mt-1 text-xs text-gray-500">Coming soon. This will allow signing in with OAuth providers.</p>
                </div>
                <label className="inline-flex items-center">
                  <input type="checkbox" disabled className="h-4 w-4 rounded border-gray-300 text-amber-600" />
                </label>
              </div>
            </section>
          </section>
        </section>
      </section>
    </section>
  )
}
