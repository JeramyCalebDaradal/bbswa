import { useMemo, useState } from 'react'
import {
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  X,
  XCircle,
} from 'lucide-react'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':')
  const hour = Number.parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

function statusMeta(status) {
  switch (status) {
    case 'confirmed':
      return { badge: 'bg-blue-100 text-blue-700 border-blue-300', Icon: CheckCircle, iconClass: 'text-blue-600' }
    case 'completed':
      return { badge: 'bg-green-100 text-green-700 border-green-300', Icon: CheckCircle, iconClass: 'text-green-600' }
    case 'cancelled':
      return { badge: 'bg-red-100 text-red-700 border-red-300', Icon: XCircle, iconClass: 'text-red-600' }
    default:
      return { badge: 'bg-amber-100 text-amber-700 border-amber-300', Icon: Clock, iconClass: 'text-amber-600' }
  }
}

export default function AppointmentDetails({ appointment, onClose, onEdit, onStatusChange }) {
  const [notes, setNotes] = useState(appointment.notes || '')
  const [isEditingNotes, setIsEditingNotes] = useState(false)

  const meta = useMemo(() => statusMeta(appointment.status), [appointment.status])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
              <p className="text-sm text-gray-600">ID: #{appointment.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 ${meta.badge}`}>
                <meta.Icon className={`h-5 w-5 ${meta.iconClass}`} />
                <span className="font-medium capitalize">{appointment.status}</span>
              </div>
              <button
                type="button"
                onClick={() => onEdit(appointment)}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
              >
                <Edit className="h-4 w-4" />
                Edit Appointment
              </button>
            </div>

            <section className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Mail className="h-5 w-5 text-amber-600" />
                Client Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">Full Name</label>
                  <p className="font-medium text-gray-900">{appointment.clientName}</p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">Email</label>
                  <a href={`mailto:${appointment.email}`} className="flex items-center gap-2 text-amber-600 hover:text-amber-700">
                    <Mail className="h-4 w-4" />
                    {appointment.email}
                  </a>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">Phone</label>
                  <a href={`tel:${appointment.phone}`} className="flex items-center gap-2 text-amber-600 hover:text-amber-700">
                    <Phone className="h-4 w-4" />
                    {appointment.phone}
                  </a>
                </div>
              </div>
            </section>

            <section className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Briefcase className="h-5 w-5 text-amber-600" />
                Appointment Details
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">Service</label>
                  <p className="font-medium text-gray-900">{appointment.service}</p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">Date</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formatDate(appointment.date)}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">Time</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {formatTime(appointment.time)}
                  </div>
                </div>
                {appointment.duration ? (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">Duration</label>
                    <p className="text-gray-900">{appointment.duration} minutes</p>
                  </div>
                ) : null}
                {appointment.location ? (
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-600">Location</label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {appointment.location}
                    </div>
                  </div>
                ) : null}
              </div>
            </section>

            <section className="rounded-lg bg-gray-50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <MessageSquare className="h-5 w-5 text-amber-600" />
                  Notes
                </h3>
                {!isEditingNotes ? (
                  <button type="button" onClick={() => setIsEditingNotes(true)} className="text-sm text-amber-600 hover:text-amber-700">
                    Edit Notes
                  </button>
                ) : null}
              </div>

              {isEditingNotes ? (
                <div className="space-y-3">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingNotes(false)}
                      className="cursor-pointer rounded-lg bg-amber-500 px-4 py-2 text-white transition-colors hover:bg-amber-600"
                    >
                      Save Notes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNotes(appointment.notes || '')
                        setIsEditingNotes(false)
                      }}
                      className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-gray-700">{notes || 'No notes added for this appointment.'}</p>
              )}
            </section>

            <section className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { label: 'Confirm', status: 'confirmed', className: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
                  { label: 'Complete', status: 'completed', className: 'bg-green-100 text-green-700 hover:bg-green-200' },
                  { label: 'Cancel', status: 'cancelled', className: 'bg-red-100 text-red-700 hover:bg-red-200' },
                  { label: 'Pending', status: 'pending', className: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
                ].map((item) => (
                  <button
                    key={item.status}
                    type="button"
                    onClick={() => onStatusChange(appointment.id, item.status)}
                    disabled={appointment.status === item.status}
                    className={`rounded-lg px-4 py-2 transition-colors ${
                      appointment.status === item.status ? 'cursor-not-allowed bg-gray-200 text-gray-400' : `cursor-pointer ${item.className}`
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
          <p className="text-sm text-gray-500">Created: {new Date().toLocaleDateString()}</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onEdit(appointment)}
              className="cursor-pointer rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-white transition-all hover:from-amber-600 hover:to-amber-700"
            >
              Edit Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

