import { useEffect, useMemo, useState } from 'react'
import { Calendar, Filter, Search } from 'lucide-react'
import { listLogs } from '../../api/logs'
import { listRoles } from '../../api/admin'

function verbMeta(verb) {
  const v = String(verb || '').trim()
  if (v === 'Created') return { className: 'text-green-700' }
  if (v === 'Edited') return { className: 'text-amber-700' }
  if (v === 'Removed') return { className: 'text-red-700' }
  return { className: 'text-gray-700' }
}

function splitAction(action) {
  const text = String(action || '').trim()
  if (!text) return { verb: '', rest: '' }
  const idx = text.indexOf(' ')
  if (idx === -1) return { verb: text, rest: '' }
  return { verb: text.slice(0, idx), rest: text.slice(idx + 1) }
}

function formatDateTime(date, time) {
  const d = String(date || '').trim()
  const t = String(time || '').trim()
  if (!d && !t) return ''
  if (!t) return d
  return `${d} ${t}`
}

export default function Logs() {
  const [roles, setRoles] = useState([])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const [page, setPage] = useState(1)
  const pageSize = 50

  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      try {
        const res = await listRoles()
        setRoles(Array.isArray(res?.roles) ? res.roles : [])
      } catch {
        setRoles([])
      }
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true)
      setError('')
      try {
        const res = await listLogs({
          page,
          pageSize,
          role: filterRole,
          action: filterAction,
          from: fromDate,
          to: toDate,
          q: searchTerm,
        })
        setRows(Array.isArray(res?.logs) ? res.logs : [])
        setTotal(Number(res?.total || 0))
      } catch (err) {
        setRows([])
        setTotal(0)
        setError(err?.message || 'Failed to load logs')
      } finally {
        setIsLoading(false)
      }
    }, 150)
    return () => window.clearTimeout(timeoutId)
  }, [filterAction, filterRole, fromDate, page, searchTerm, toDate])

  const totalPages = useMemo(() => {
    const pages = Math.ceil(Number(total || 0) / pageSize)
    return pages > 0 ? pages : 1
  }, [total])

  return (
    <section className="space-y-6">
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Activity Logs</h2>
          <p className="mt-1 text-gray-600">Track dashboard actions across all users</p>
        </div>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user ID or name..."
              value={searchTerm}
              onChange={(e) => {
                setPage(1)
                setSearchTerm(e.target.value)
              }}
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => {
                  setPage(1)
                  setFilterRole(e.target.value)
                }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Roles</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterAction}
                onChange={(e) => {
                  setPage(1)
                  setFilterAction(e.target.value)
                }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Actions</option>
                <option value="created">Created</option>
                <option value="edited">Edited</option>
                <option value="removed">Removed</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setPage(1)
                  setFromDate(e.target.value)
                }}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-500">to</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setPage(1)
                  setToDate(e.target.value)
                }}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {error ? <section className="border-b border-red-200 bg-red-50 px-6 py-3 text-sm text-red-700">{error}</section> : null}
        {isLoading ? (
          <section className="border-b border-gray-100 bg-white px-6 py-3 text-sm text-gray-600">Loading logs...</section>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Full name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!isLoading && !error && rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-600">
                    No logs found.
                  </td>
                </tr>
              ) : null}

              {rows.map((row) => {
                const { verb, rest } = splitAction(row.action)
                const meta = verbMeta(verb)
                return (
                  <tr key={row.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-3 text-xs text-gray-700">{row.user_id}</td>
                    <td className="px-6 py-3 text-xs text-gray-700">{row.full_name}</td>
                    <td className="px-6 py-3 text-xs text-gray-700">{row.role}</td>
                    <td className="px-6 py-3 text-xs text-gray-700">
                      <div className="max-h-[2.5rem] w-[420px] max-w-[420px] overflow-hidden break-words leading-5">
                        {verb ? <span className={`font-semibold ${meta.className}`}>{verb}</span> : null}
                        {verb && rest ? <span> {rest}</span> : rest ? <span>{rest}</span> : null}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-700">{formatDateTime(row.date, row.time)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <section className="flex flex-col gap-3 border-t border-gray-100 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-600">
            Showing {rows.length ? (page - 1) * pageSize + 1 : 0}–{(page - 1) * pageSize + rows.length} of {total}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Prev
            </button>
            <p className="text-xs text-gray-600">
              Page {page} / {totalPages}
            </p>
            <button
              type="button"
              onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
              disabled={page >= totalPages}
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next
            </button>
          </div>
        </section>
      </section>
    </section>
  )
}
