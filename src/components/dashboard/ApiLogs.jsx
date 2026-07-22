import { useEffect, useMemo, useState } from 'react'
import { Calendar, Filter, Search } from 'lucide-react'
import { listApiLogs } from '../../api/apiLogs'

function statusBadgeClass(code) {
  const n = Number(code)
  if (n >= 200 && n < 300) return 'bg-green-100 text-green-800'
  if (n >= 300 && n < 400) return 'bg-blue-100 text-blue-800'
  if (n >= 400 && n < 500) return 'bg-amber-100 text-amber-800'
  if (n >= 500) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

function methodBadgeClass(method) {
  const m = String(method || '').toUpperCase()
  if (m === 'GET') return 'bg-sky-100 text-sky-700'
  if (m === 'POST') return 'bg-emerald-100 text-emerald-700'
  if (m === 'PUT' || m === 'PATCH') return 'bg-indigo-100 text-indigo-700'
  if (m === 'DELETE') return 'bg-rose-100 text-rose-700'
  return 'bg-gray-100 text-gray-700'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const parts = String(dateStr).split('-')
  if (parts.length !== 3) return dateStr
  return `${parts[1]}-${parts[2]}-${parts[0]}`
}

function formatTime(time) {
  if (!time) return ''
  return String(time).slice(0, 5)
}

function extractBrowser(ua) {
  if (!ua) return null
  const s = String(ua)
  if (s.includes('Edg/') || s.includes('Edge/')) return 'Edge'
  if (s.includes('Chrome/') && !s.includes('Edg/')) return 'Chrome'
  if (s.includes('Firefox/')) return 'Firefox'
  if (s.includes('Safari/') && !s.includes('Chrome/')) return 'Safari'
  if (s.includes('OPR/') || s.includes('Opera/')) return 'Opera'
  if (s.includes('Trident/') || s.includes('MSIE')) return 'Internet Explorer'
  return 'Unknown'
}

function truncateUrl(url, max = 80) {
  const s = String(url || '')
  if (s.length <= max) return s
  return `${s.slice(0, max)}...`
}

export default function ApiLogs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterMethod, setFilterMethod] = useState('')
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
      setIsLoading(true)
      setError('')
      try {
        const res = await listApiLogs({
          page,
          pageSize,
          status: filterStatus,
          q: searchTerm,
          from: fromDate,
          to: toDate,
        })
        setRows(Array.isArray(res?.logs) ? res.logs : [])
        setTotal(Number(res?.total || 0))
      } catch (err) {
        setRows([])
        setTotal(0)
        setError(err?.message || 'Failed to load API logs')
      } finally {
        setIsLoading(false)
      }
    }, 150)
    return () => window.clearTimeout(timeoutId)
  }, [filterStatus, filterMethod, fromDate, page, searchTerm, toDate])

  const totalPages = useMemo(() => {
    const pages = Math.ceil(Number(total || 0) / pageSize)
    return pages > 0 ? pages : 1
  }, [total])

  return (
    <section className="space-y-6">
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">API Logs</h2>
          <p className="mt-1 text-gray-600">Track all API requests routed through nginx</p>
        </div>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by URL, IP, or user ID..."
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
                value={filterStatus}
                onChange={(e) => {
                  setPage(1)
                  setFilterStatus(e.target.value)
                }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Status</option>
                <option value="200">200 OK</option>
                <option value="201">201 Created</option>
                <option value="204">204 No Content</option>
                <option value="301">301 Moved</option>
                <option value="400">400 Bad Request</option>
                <option value="401">401 Unauthorized</option>
                <option value="403">403 Forbidden</option>
                <option value="404">404 Not Found</option>
                <option value="409">409 Conflict</option>
                <option value="429">429 Rate Limited</option>
                <option value="500">500 Server Error</option>
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
          <section className="border-b border-gray-100 bg-white px-6 py-3 text-sm text-gray-600">Loading API logs...</section>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">URL</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">IP</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Response</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Browser</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!isLoading && rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-sm text-gray-500">
                    No API logs found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const emailPrefix = row.user_email ? String(row.user_email).split('@')[0] : null
                  const browser = extractBrowser(row.user_agent)
                  return (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {emailPrefix ? (
                        <span className="group relative cursor-help border-b border-dotted border-gray-300">
                          {emailPrefix}
                          <span className="invisible group-hover:visible absolute bottom-full left-0 mb-1 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-lg z-10">
                            {row.user_email}
                          </span>
                        </span>
                      ) : (
                        <span className="text-gray-300">&mdash;</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-600">
                      {formatDate(row.date_sent)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {formatTime(row.time_sent)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${methodBadgeClass(row.method)}`}>
                        {row.method}
                      </span>
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-sm text-gray-700" title={row.url}>
                      {truncateUrl(row.url)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass(row.status_code)}`}>
                        {row.status_code}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-600">
                      {row.ip_address}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {row.response_time_ms != null ? `${row.response_time_ms}ms` : <span className="text-gray-300">&mdash;</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {browser ? (
                        <span className="group relative cursor-help border-b border-dotted border-gray-300">
                          {browser}
                          <span className="invisible group-hover:visible absolute bottom-full left-0 mb-1 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-lg z-10">
                            {row.user_agent}
                          </span>
                        </span>
                      ) : (
                        <span className="text-gray-300">&mdash;</span>
                      )}
                    </td>
                  </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {total > 0 ? (
          <section className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
            <p className="text-sm text-gray-600">
              Page {page} of {totalPages} &bull; {total} total
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
        ) : null}
      </section>
    </section>
  )
}