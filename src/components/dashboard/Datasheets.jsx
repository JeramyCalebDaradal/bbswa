import { useEffect, useMemo, useState } from 'react'
import { FileText, Filter, Search } from 'lucide-react'
import { createDatasheet, deleteDatasheet, listDatasheets, updateDatasheet } from '../../api/datasheets'
import { readUser } from '../../auth/session'
import { useToast } from '../ui/useToast'
import CreateEditDatasheet from './CreateEditDatasheet'

function formatDateOnly(value) {
  if (!value) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  const v = String(value)
  if (v.includes('T')) return v.split('T')[0]
  const m = v.match(/^(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : v
}

function formatBytes(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = n
  let idx = 0
  while (size >= 1024 && idx < units.length - 1) {
    size /= 1024
    idx += 1
  }
  const digits = idx === 0 ? 0 : size >= 10 ? 1 : 2
  return `${size.toFixed(digits)} ${units[idx]}`
}

export default function Datasheets() {
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const totalPages = useMemo(() => {
    const t = Number(total || 0)
    const s = Number(pageSize || 20)
    if (!Number.isFinite(t) || t <= 0) return 1
    if (!Number.isFinite(s) || s <= 0) return 1
    return Math.max(1, Math.ceil(t / s))
  }, [pageSize, total])

  const refresh = async ({ nextPage } = {}) => {
    setError('')
    setIsLoading(true)
    try {
      const targetPage = Number.isFinite(Number(nextPage)) && Number(nextPage) > 0 ? Math.trunc(Number(nextPage)) : page
      const res = await listDatasheets({ page: targetPage, status: filterStatus, q: searchTerm })
      const list = Array.isArray(res?.datasheets) ? res.datasheets : []
      setPage(Number(res?.page || targetPage) || targetPage)
      setPageSize(Number(res?.pageSize || 20) || 20)
      setTotal(Number(res?.total || 0) || 0)
      setRows(
        list.map((d) => ({
          id: d.id,
          title: d.title,
          description: d.description || '',
          filePath: d.file_path,
          size: d.size ?? null,
          status: String(d.status || 'active').toLowerCase(),
          dateCreated: d.date_created,
          addedBy: d.added_by,
        }))
      )
    } catch (err) {
      setError(err?.message || 'Failed to load datasheets')
      setRows([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      refresh()
    }, searchTerm ? 300 : 0)
    return () => window.clearTimeout(timeoutId)
  }, [filterStatus, page, searchTerm])

  const handleSave = async (formData) => {
    setIsSaving(true)
    setError('')
    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        file_path: formData.filePath,
        size: formData.size ?? null,
        status: formData.status,
      }

      if (editing?.id) {
        await updateDatasheet(editing.id, payload)
        await refresh()
        toast.success('Datasheet updated successfully.')
        return
      }

      const user = readUser()
      const addedBy = user?.id
      if (!addedBy) throw new Error('Missing logged-in user')
      await createDatasheet({ ...payload, added_by: addedBy })
      await refresh({ nextPage: 1 })
      toast.success('Datasheet created successfully.')
    } catch (err) {
      const message = err?.message || 'Failed to save datasheet'
      toast.error(message)
      throw err
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editing?.id) return
    setIsDeleting(true)
    setError('')
    try {
      await deleteDatasheet(editing.id)
      await refresh()
      toast.success('Datasheet deleted successfully.')
    } catch (err) {
      const message = err?.message || 'Failed to delete datasheet'
      toast.error(message)
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <section className="space-y-6">
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Datasheets</h2>
          <p className="mt-1 text-gray-600">Manage PDF resources for the public Resources page</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null)
            setShowModal(true)
          }}
          className="cursor-pointer rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-white shadow-sm transition-all hover:from-amber-600 hover:to-amber-700"
        >
          + Add Datasheet
        </button>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <section className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or file..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value)
                setPage(1)
              }}
              className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={refresh}
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </section>

        {error ? <section className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</section> : null}

        <section className="mt-4 overflow-hidden rounded-lg border border-gray-100">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600">File</th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600">Date Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-600">
                    Loading datasheets...
                  </td>
                </tr>
              ) : null}

              {!isLoading && !error && rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-600">
                    No datasheets yet.
                  </td>
                </tr>
              ) : null}

              {!isLoading
                ? rows.map((d) => (
                    <tr key={d.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                            <FileText className="h-5 w-5 text-amber-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900">{d.title}</p>
                            {d.description ? <p className="mt-1 line-clamp-2 text-sm text-gray-600">{d.description}</p> : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{d.filePath}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatBytes(d.size)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            d.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {d.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatDateOnly(d.dateCreated) || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(d)
                            setShowModal(true)
                          }}
                          className="text-sm font-medium text-amber-600 hover:text-amber-700"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </section>
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages} • {total} total
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, Number(p || 1) - 1))}
            disabled={isLoading || page <= 1}
            className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, Number(p || 1) + 1))}
            disabled={isLoading || page >= totalPages}
            className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </section>

      {showModal ? (
        <CreateEditDatasheet
          mode={editing ? 'edit' : 'create'}
          datasheet={editing || undefined}
          onSave={handleSave}
          onDelete={handleDelete}
          isSaving={isSaving}
          isDeleting={isDeleting}
          onClose={() => {
            setShowModal(false)
            setEditing(null)
          }}
        />
      ) : null}
    </section>
  )
}
