import { useState, useEffect, useCallback } from 'react'
import { Search, RefreshCw, UserCheck, UserX, AlertCircle } from 'lucide-react'
import { listBbsUsers } from '../../../api/admin'

const ROLE_BADGE = {
  Administrator: 'bg-purple-100 text-purple-800',
  ContentManager: 'bg-blue-100 text-blue-800',
  Analyst: 'bg-green-100 text-green-800',
  Default: 'bg-gray-100 text-gray-600',
}

function RoleBadge({ role }) {
  const cls = ROLE_BADGE[role] || ROLE_BADGE.Default
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {role || 'Default'}
    </span>
  )
}

export default function UsersSection() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const fetchUsers = useCallback(async (searchVal) => {
    setLoading(true)
    setError(null)
    try {
      const result = await listBbsUsers({ search: searchVal })
      setUsers(Array.isArray(result.users) ? result.users : [])
    } catch (err) {
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers(search)
  }, [search, fetchUsers])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput.trim())
  }

  const handleRefresh = () => {
    setSearch('')
    setSearchInput('')
    fetchUsers('')
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Directory</h1>
          <p className="mt-1 text-sm text-gray-500">
            Users from the Entra application &mdash; {users.length} user{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          Search
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading && !users.length ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.oid || u.email} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-semibold text-white">
                          {String(u.display_name || u.email || '?')[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{u.display_name || '—'}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{u.email || u.user_principal_name || '—'}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <RoleBadge role={u.app_role} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{u.department || '—'}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{u.job_title || '—'}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {u.account_enabled ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                          <UserCheck className="h-3.5 w-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                          <UserX className="h-3.5 w-3.5" /> Disabled
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
