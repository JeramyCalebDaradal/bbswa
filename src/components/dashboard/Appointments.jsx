import { useEffect, useMemo, useState } from 'react'
import { Calendar, CheckCircle, Clock, Filter, Mail, Phone, Search, XCircle } from 'lucide-react'
import AppointmentDetails from './AppointmentDetails'
import CreateEditAppointment from './CreateEditAppointment'
import { createAppointment, listAppointments, updateAppointment } from '../../api/appointments'
import { readUser } from '../../auth/session'
import { useToast } from '../ui/useToast'

function StatusBadge({ status }) {
  const styles = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', Icon: Clock },
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', Icon: CheckCircle },
    completed: { bg: 'bg-green-100', text: 'text-green-700', Icon: CheckCircle },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', Icon: XCircle },
  }

  const style = styles[status] || styles.pending
  const Icon = style.Icon

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${style.bg} ${style.text}`}>
      <Icon className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':')
  const hour = Number.parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

function formatDateOnly(value) {
  if (!value) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  const v = String(value)
  if (v.includes('T')) return v.split('T')[0]
  const m = v.match(/^(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : v
}

export default function Appointments() {
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)

  const [appointments, setAppointments] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

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
      const res = await listAppointments({ page: targetPage, status: filterStatus, q: searchTerm })
      const rows = Array.isArray(res?.appointments) ? res.appointments : []
      setPage(Number(res?.page || targetPage) || targetPage)
      setPageSize(Number(res?.pageSize || 20) || 20)
      setTotal(Number(res?.total || 0) || 0)
      setAppointments(
        rows.map((row) => ({
          id: row.id,
          clientName: row.full_name,
          email: row.email,
          phone: row.contact_number,
          date: formatDateOnly(row.date_set),
          time: row.time_set,
          status: String(row.status || 'pending').toLowerCase(),
          service: row.service,
          notes: row.notes || '',
          location: row.location,
          duration: Number(row.duration || 0),
          dateCreated: formatDateOnly(row.date_created),
          addedBy: row.added_by,
        }))
      )
    } catch (err) {
      setError(err?.message || 'Failed to load appointments')
      setAppointments([])
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

  const handleSaveAppointment = async (appointmentData) => {
    setIsSaving(true)
    setError('')
    try {
      const user = readUser()
      const addedBy = user?.id
      if (!addedBy) {
        throw new Error('Missing logged-in user')
      }

      const payload = {
        full_name: appointmentData.clientName,
        email: appointmentData.email,
        contact_number: appointmentData.phone,
        service: appointmentData.service,
        date_set: appointmentData.date,
        time_set: appointmentData.time,
        status: appointmentData.status,
        location: appointmentData.location,
        duration: appointmentData.duration,
        notes: appointmentData.notes,
        added_by: addedBy,
      }

      const updateId = editingAppointment?.id ?? appointmentData?.id

      if (updateId) {
        await updateAppointment(updateId, payload)
        await refresh()
        toast.success('Appointment updated successfully.')
        return
      }

      await createAppointment(payload)
      await refresh({ nextPage: 1 })
      toast.success('Appointment created successfully.')
    } catch (err) {
      const message = err?.message || 'Failed to save appointment'
      toast.error(message)
      throw err
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = (id, status) => {
    const target = appointments.find((a) => a.id === id)
    if (!target) return
    handleSaveAppointment({ ...target, status })
      .then(() => {
        if (selectedAppointment && selectedAppointment.id === id) {
          setSelectedAppointment((prev) => (prev ? { ...prev, status } : prev))
        }
      })
      .catch(() => {})
  }

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment)
    setSelectedAppointment(null)
    setShowCreateModal(true)
  }

  return (
    <>
      <section className="space-y-6">
        <section className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Appointments</h2>
            <p className="mt-1 text-gray-600">Manage and track all client appointments</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingAppointment(null)
              setShowCreateModal(true)
            }}
            className="cursor-pointer rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-white shadow-sm transition-all hover:from-amber-600 hover:to-amber-700"
          >
            + New Appointment
          </button>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
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
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-6 text-sm text-red-700">
                      {error}
                    </td>
                  </tr>
                ) : null}

                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-600">
                      Loading appointments...
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !error && appointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-600">
                      No appointments found.
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !error
                  ? appointments.map((apt) => (
                      <tr
                        key={apt.id}
                        onClick={() => setSelectedAppointment(apt)}
                        className="cursor-pointer transition-colors hover:bg-gray-50"
                      >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{apt.clientName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          {apt.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          {apt.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{apt.service}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium">{apt.date}</p>
                          <p className="text-gray-600">{formatTime(apt.time)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedAppointment(apt)
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
          </div>
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
      </section>

      {selectedAppointment ? (
        <AppointmentDetails
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onEdit={handleEditAppointment}
          onStatusChange={handleStatusChange}
        />
      ) : null}

      {showCreateModal ? (
        <CreateEditAppointment
          mode={editingAppointment ? 'edit' : 'create'}
          appointment={editingAppointment || undefined}
          onSave={handleSaveAppointment}
          isSaving={isSaving}
          onClose={() => {
            setShowCreateModal(false)
            setEditingAppointment(null)
          }}
        />
      ) : null}
    </>
  )
}
