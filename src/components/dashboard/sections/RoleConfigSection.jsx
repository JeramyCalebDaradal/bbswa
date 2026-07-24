import { useState, useEffect, useCallback } from 'react'
import { Save, AlertCircle, CheckCircle } from 'lucide-react'
import { listRoleConfigs, updateRoleConfig } from '../../../api/admin'

// All page keys that can be toggled - must match backend page keys
const ALL_PAGES = [
  { key: 'blog', label: 'Articles / Blog' },
  { key: 'datasheets', label: 'Datasheets' },
  { key: 'info-videos', label: 'Informational Videos' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'events', label: 'Events' },
  { key: 'leads', label: 'Leads' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'reports', label: 'Reports' },
  { key: 'logs', label: 'Action Logs' },
  { key: 'api-logs', label: 'API Logs' },
  { key: 'settings', label: 'Settings' },
  { key: 'users', label: 'User Directory' },
  { key: 'role-config', label: 'Role Config' },
]

const ROLE_COLORS = {
  Administrator: 'border-purple-300 bg-purple-50',
  ContentManager: 'border-blue-300 bg-blue-50',
  Analyst: 'border-green-300 bg-green-50',
  Default: 'border-gray-200 bg-gray-50',
}

function RoleCard({ roleConfig, onSave }) {
  const [pages, setPages] = useState(() => new Set(roleConfig.allowed_pages_json || []))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)
  const isDirty = JSON.stringify([...pages].sort()) !== JSON.stringify([...(roleConfig.allowed_pages_json || [])].sort())

  const toggle = (key) => {
    setPages((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await onSave(roleConfig.role_name, [...pages])
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const cardClass = ROLE_COLORS[roleConfig.role_name] || ROLE_COLORS.Default

  return (
    <div className={`rounded-xl border-2 p-5 ${cardClass}`}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{roleConfig.role_name}</h3>
          {roleConfig.description && (
            <p className="mt-0.5 text-xs text-gray-500">{roleConfig.description}</p>
          )}
        </div>
        {isDirty && (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-600 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-2">
        {ALL_PAGES.map((p) => {
          const checked = pages.has(p.key)
          return (
            <label
              key={p.key}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/50"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(p.key)}
                className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-amber-500"
              />
              <span className={`text-sm ${checked ? 'font-medium text-gray-800' : 'text-gray-500'}`}>
                {p.label}
              </span>
            </label>
          )
        })}
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </div>
      )}
      {saved && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-green-600">
          <CheckCircle className="h-3.5 w-3.5" /> Saved successfully
        </div>
      )}
    </div>
  )
}

export default function RoleConfigSection() {
  const [configs, setConfigs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchConfigs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await listRoleConfigs()
      setConfigs(result.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load role configs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConfigs()
  }, [fetchConfigs])

  const handleSave = async (roleName, allowedPages) => {
    await updateRoleConfig(roleName, allowedPages)
    // Refresh to keep in sync
    await fetchConfigs()
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Role Configuration</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure which dashboard pages each Entra role can access. Changes take effect immediately.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {loading && !configs.length ? (
        <p className="text-sm text-gray-500">Loading role configurations...</p>
      ) : configs.length === 0 && !loading ? (
        <p className="text-sm text-gray-500">No role configurations found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {configs.map((rc) => (
            <RoleCard key={rc.role_name} roleConfig={rc} onSave={handleSave} />
          ))}
        </div>
      )}
    </section>
  )
}
