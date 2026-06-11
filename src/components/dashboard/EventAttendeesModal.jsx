function downloadCsv(filename, rows) {
  const header = ['Name', 'Email', 'Contact Number']
  const escapeCell = (value) => {
    const v = String(value ?? '')
    const needsQuotes = /[",\n]/.test(v)
    const escaped = v.replace(/"/g, '""')
    return needsQuotes ? `"${escaped}"` : escaped
  }

  const lines = [header.join(','), ...rows.map((r) => [r.name, r.email, r.contact_number].map(escapeCell).join(','))]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function EventAttendeesModal({
  open,
  eventTitle,
  attendees,
  isLoading,
  error,
  onClose,
  onRefresh,
}) {
  if (!open) return null

  const safeAttendees = Array.isArray(attendees) ? attendees : []

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/60" onClick={onClose} aria-label="Close" />
      <section className="relative w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
        <section className="flex items-start justify-between gap-4 border-b border-gray-100 p-6">
          <section>
            <h3 className="text-xl font-semibold text-gray-900">View attendees</h3>
            <p className="mt-1 text-sm text-gray-600">{eventTitle || 'Event'}</p>
          </section>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </section>

        <section className="space-y-4 p-6">
          <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <section className="text-sm text-gray-700">
              <span className="font-medium">Attendees:</span> {safeAttendees.length}
            </section>

            <section className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={onRefresh}
                disabled={isLoading}
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-amber-600 hover:to-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => downloadCsv('event-attendees.csv', safeAttendees)}
                disabled={isLoading || safeAttendees.length === 0}
              >
                Download excel
              </button>
            </section>
          </section>

          {error ? (
            <section className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</section>
          ) : null}

          <section className="overflow-hidden rounded-lg border border-gray-100">
            <section className="max-h-[55vh] overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                      Contact number
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {safeAttendees.length ? (
                    safeAttendees.map((a, idx) => (
                      <tr key={`${a.email || 'attendee'}-${idx}`} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{a.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{a.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{a.contact_number}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-600">
                        {isLoading ? 'Loading attendees...' : 'No attendees yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </section>
        </section>
      </section>
    </section>
  )
}
