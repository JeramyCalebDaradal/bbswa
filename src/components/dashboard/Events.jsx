import { useMemo, useState } from 'react'
import { Calendar, Eye, Link as LinkIcon, MapPin, Plus, Search, Users } from 'lucide-react'
import CreateEditEvent from './CreateEditEvent'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(timeString) {
  const [hours, minutes] = String(timeString || '').split(':')
  const hour = Number.parseInt(hours || '0', 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes || '00'} ${ampm}`
}

function Pill({ variant, children }) {
  const styles =
    variant === 'online'
      ? 'bg-blue-100 text-blue-700'
      : variant === 'physical'
        ? 'bg-purple-100 text-purple-700'
        : 'bg-amber-100 text-amber-700'
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles}`}>{children}</span>
}

export default function Events() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Cybersecurity Best Practices Webinar',
      date: '2026-06-15',
      time: '14:00',
      location: 'Online (Zoom)',
      locationType: 'online',
      description: 'Learn essential cybersecurity best practices for your organization.',
      attendees: 45,
      maxCapacity: 100,
      status: 'upcoming',
      registrationOpen: true,
      category: 'Webinar',
      price: 0,
      isPaid: false,
      meetingLink: 'https://zoom.us/j/123456789',
      contactEmail: 'events@blackbearsecurities.com',
      contactPhone: '+1 (555) 000-0000',
      tags: ['Cybersecurity', 'Training'],
    },
    {
      id: 2,
      title: 'GDPR Compliance Workshop',
      date: '2026-06-22',
      time: '10:00',
      location: 'Conference Center, Boston',
      locationType: 'physical',
      description: 'In-depth workshop on GDPR compliance requirements.',
      attendees: 32,
      maxCapacity: 50,
      status: 'upcoming',
      registrationOpen: true,
      category: 'Workshop',
      price: 299,
      isPaid: true,
      contactEmail: 'events@blackbearsecurities.com',
      contactPhone: '+1 (555) 000-0000',
      tags: ['Compliance', 'GDPR'],
    },
    {
      id: 3,
      title: 'Incident Response Training',
      date: '2026-07-05',
      time: '09:00',
      location: 'Training Facility, New York',
      locationType: 'physical',
      description: 'Hands-on incident response training for security teams.',
      attendees: 28,
      maxCapacity: 30,
      status: 'upcoming',
      registrationOpen: true,
      category: 'Training',
      price: 499,
      isPaid: true,
      contactEmail: 'events@blackbearsecurities.com',
      contactPhone: '+1 (555) 000-0000',
      tags: ['Training', 'Incident Response'],
    },
  ])

  const filteredEvents = useMemo(() => {
    const needle = searchTerm.toLowerCase()
    return events.filter((evt) => evt.title.toLowerCase().includes(needle) || evt.category.toLowerCase().includes(needle))
  }, [events, searchTerm])

  const handleSave = (eventData) => {
    if (editingEvent) {
      setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? { ...eventData, id: editingEvent.id } : e)))
      return
    }
    const nextId = Math.max(...events.map((e) => e.id)) + 1
    setEvents((prev) => [...prev, { ...eventData, id: nextId, attendees: 0, status: 'upcoming' }])
  }

  return (
    <>
      <section className="space-y-6">
        <section className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Events</h2>
            <p className="mt-1 text-gray-600">Create and manage event listings</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingEvent(null)
              setShowCreateModal(true)
            }}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-white shadow-sm transition-all hover:from-amber-600 hover:to-amber-700"
          >
            <Plus className="h-4 w-4" />
            New Event
          </button>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredEvents.map((evt) => (
            <section key={evt.id} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">{evt.title}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill variant={evt.locationType}>{evt.locationType === 'online' ? 'Virtual' : 'In-Person'}</Pill>
                    <Pill variant="category">{evt.category}</Pill>
                    {evt.isPaid ? <Pill variant="category">${evt.price}</Pill> : <Pill variant="category">Free</Pill>}
                  </div>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-amber-600 hover:text-amber-700"
                  onClick={() => {
                    setEditingEvent(evt)
                    setShowCreateModal(true)
                  }}
                >
                  Edit
                </button>
              </div>

              <p className="mt-3 text-sm text-gray-600">{evt.description}</p>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {formatDate(evt.date)} • {formatTime(evt.time)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {evt.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Users className="h-4 w-4 text-gray-400" />
                  {evt.attendees}/{evt.maxCapacity} attendees
                </div>
                {evt.meetingLink ? (
                  <a href={evt.meetingLink} className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700">
                    <LinkIcon className="h-4 w-4" />
                    Meeting Link
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Eye className="h-4 w-4 text-gray-400" />
                    Landing Preview
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {evt.tags?.map((tag) => (
                  <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </section>
      </section>

      {showCreateModal ? (
        <CreateEditEvent
          mode={editingEvent ? 'edit' : 'create'}
          event={editingEvent || undefined}
          onSave={handleSave}
          onClose={() => {
            setShowCreateModal(false)
            setEditingEvent(null)
          }}
        />
      ) : null}
    </>
  )
}

