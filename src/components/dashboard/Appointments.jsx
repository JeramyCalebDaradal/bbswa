import { useMemo, useState } from 'react'
import { Calendar, CheckCircle, Clock, Filter, Mail, Phone, Search, XCircle } from 'lucide-react'
import AppointmentDetails from './AppointmentDetails'
import CreateEditAppointment from './CreateEditAppointment'

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

export default function Appointments() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      clientName: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      phone: '+1 (555) 123-4567',
      date: '2026-06-05',
      time: '10:00',
      status: 'confirmed',
      service: 'Security Assessment',
      notes: 'Client interested in comprehensive security audit for their cloud infrastructure.',
      location: 'Office - Black Bear Securities',
      duration: 60,
    },
    {
      id: 2,
      clientName: 'Michael Chen',
      email: 'm.chen@tech.com',
      phone: '+1 (555) 234-5678',
      date: '2026-06-07',
      time: '14:00',
      status: 'pending',
      service: 'Penetration Testing',
      notes: 'Follow-up from initial consultation. Needs testing before Q3 launch.',
      location: 'Online - Zoom',
      duration: 90,
    },
    {
      id: 3,
      clientName: 'Emily Rodriguez',
      email: 'emily.r@startup.io',
      phone: '+1 (555) 345-6789',
      date: '2026-06-10',
      time: '11:30',
      status: 'completed',
      service: 'Compliance Consultation',
      notes: 'Discussed GDPR compliance requirements for EU expansion.',
      location: 'Office - Black Bear Securities',
      duration: 60,
    },
    {
      id: 4,
      clientName: 'David Kim',
      email: 'david@enterprise.com',
      phone: '+1 (555) 456-7890',
      date: '2026-06-12',
      time: '15:00',
      status: 'confirmed',
      service: 'Annual Security Review',
      location: 'Client Site - Enterprise HQ',
      duration: 120,
    },
    {
      id: 5,
      clientName: 'Lisa Wang',
      email: 'l.wang@business.com',
      phone: '+1 (555) 567-8901',
      date: '2026-06-03',
      time: '09:00',
      status: 'cancelled',
      service: 'Risk Assessment',
      notes: 'Client requested reschedule due to conflicting meeting.',
      location: 'Office - Black Bear Securities',
      duration: 45,
    },
  ])

  const filteredAppointments = useMemo(() => {
    const needle = searchTerm.toLowerCase()
    return appointments.filter((apt) => {
      const matchesSearch = apt.clientName.toLowerCase().includes(needle) || apt.email.toLowerCase().includes(needle)
      const matchesFilter = filterStatus === 'all' || apt.status === filterStatus
      return matchesSearch && matchesFilter
    })
  }, [appointments, filterStatus, searchTerm])

  const handleSaveAppointment = (appointmentData) => {
    if (editingAppointment) {
      setAppointments((prev) => prev.map((apt) => (apt.id === editingAppointment.id ? { ...appointmentData, id: editingAppointment.id } : apt)))
      return
    }

    const nextId = Math.max(...appointments.map((a) => a.id)) + 1
    setAppointments((prev) => [...prev, { ...appointmentData, id: nextId }])
  }

  const handleStatusChange = (id, status) => {
    setAppointments((prev) => prev.map((apt) => (apt.id === id ? { ...apt, status } : apt)))
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment({ ...selectedAppointment, status })
    }
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
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
                {filteredAppointments.map((apt) => (
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
                ))}
              </tbody>
            </table>
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
          onClose={() => {
            setShowCreateModal(false)
            setEditingAppointment(null)
          }}
        />
      ) : null}
    </>
  )
}

