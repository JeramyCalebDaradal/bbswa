import { useState, useEffect, useCallback } from 'react'
import { Save, AlertCircle, CheckCircle, Plus, Trash2 } from 'lucide-react'
import { listRoleConfigs, updateRoleConfig, deleteRoleConfig } from '../../../api/admin'

const ALL_PAGES = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'articles', label: 'Articles / Blog' },
  { key: 'datasheets', label: 'Datasheets' },
  { key: 'videos', label: 'Informational Videos' },
  { key: 'events', label: 'Events' },
  { key: 'leads', label: 'Leads' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'reports', label: 'Reports' },
  { key: 'logs', label: 'Action Logs' },
  { key: 'api-logs', label: 'API Logs' },
  { key: 'settings', label: 'Settings' },
  { key: 'users', label: 'User Directory' },
  { key: 'roles', label: 'Roles' },
]

const ROLE_COLORS = {
  Administrator: 'border-purple-300 bg-purple-50',
  ContentManager: 'border-blue-300 bg-blue-50',
  Analyst: 'border-green-300 bg-green-50',
  Default: 'border-gray-200 bg-gray-50',
}

function normalizePages(pages) {
  if (!Array.isArray(pages)) return []
  return pages
    .map((page) => String(page || '').trim())
    .filter(Boolean)
}

function RoleCard({ roleConfig, onSave, onDelete }) {
  const initialPages = normalizePages(roleConfig.allowed_pages)
  const [pages, setPages] = useState(() => new Set(initialPages))
  const [description, setDescription] = useState(roleConfig.description || '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setPages(new Set(normalizePages(roleConfig.allowed_pages)))
    setDescription(roleConfig.description || '')
    setSaved(false)
    setError(null)
  }, [roleConfig])

  const sortedPages = [...pages].sort()
  const initialSortedPages = [...initialPages].sort()
  const isDirty = JSON.stringify(sortedPages) !== JSON.stringify(initialSortedPages)
    || description !== (roleConfig.description || '')
  const canDelete = roleConfig.role_name !== 'Administrator' && roleConfig.role_name !== 'Default'

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
      await onSave(roleConfig.role_name, { allowedPages: [...pages], description })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!canDelete) return
    if (!window.confirm(`Remove role "${roleConfig.role_name}"?`)) return

    setDeleting(true)
    setError(null)
    try {
      await onDelete(roleConfig.role_name)
    } catch (err) {
      setError(err.message || 'Failed to delete role')
      setDeleting(false)
    }
  }

  const cardClass = ROLE_COLORS[roleConfig.role_name] || ROLE_COLORS.Default

  return (
    <div className={`rounded-xl border-2 p-5 ${cardClass}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-gray-900">{roleConfig.role_name}</h3>
          <input
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              setSaved(false)
            }}
            placeholder="Role description"
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-0 placeholder:text-gray-400 focus:border-amber-400"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {deleting ? 'Removing...' : 'Remove'}
            </button>
          )}

          {isDirty && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-white hover:bg-amber-600 disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
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
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleDescription, setNewRoleDescription] = useState('')
  const [creating, setCreating] = useState(false)

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

  const handleSave = async (roleName, { allowedPages, description }) => {
    await updateRoleConfig(roleName, { allowedPages, description })
    await fetchConfigs()
  }

  const handleDelete = async (roleName) => {
    await deleteRoleConfig(roleName)
    await fetchConfigs()
  }

  const handleCreateRole = async () => {
    const roleName = newRoleName.trim()
    if (!roleName) {
      setError('Role name is required')
      return
    }

    setCreating(true)
    setError(null)
    try {
      await updateRoleConfig(roleName, {
        allowedPages: [],
        description: newRoleDescription.trim(),
      })
      setNewRoleName('')
      setNewRoleDescription('')
      await fetchConfigs()
    } catch (err) {
      setError(err.message || 'Failed to create role')
    } finally {
      setCreating(false)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Role Configuration</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure which dashboard pages each Entra role can access. Changes take effect immediately.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">Add role</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="Role name"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-amber-400"
          />
          <input
            type="text"
            value={newRoleDescription}
            onChange={(e) => setNewRoleDescription(e.target.value)}
            placeholder="Description"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-amber-400"
          />
          <button
            type="button"
            onClick={handleCreateRole}
            disabled={creating}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {creating ? 'Adding...' : 'Add Role'}
          </button>
        </div>
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
            <RoleCard
              key={rc.role_name}
              roleConfig={rc}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  )
}
