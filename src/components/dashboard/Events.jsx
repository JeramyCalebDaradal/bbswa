import { useEffect, useMemo, useState } from 'react'
import { Calendar, CalendarDays, ChevronDown, Eye, Link2, MapPin, Plus, Search, Users } from 'lucide-react'
import { createEvent, deleteEvent, getEventAttendees, listEvents, updateEvent } from '../../api/events'
import { readUser } from '../../auth/session'
import { useToast } from '../ui/useToast'
import CreateEditEvent from './CreateEditEvent'

function formatDate(value) {
  if (!value) return 'No date set'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(value) {
  if (!value) return 'No time set'
  const [h, m] = String(value).split(':')
  const hour = Number(h)
  const minute = Number(m)
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return String(value)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const normalized = hour % 12 || 12
  return `${normalized}:${String(minute).padStart(2, '0')} ${suffix}`
}

function normalizeEvent(row) {
  return {
    id: row.id,
    title: row.title,
    preview_image: row.preview_image || '',
    date: row.date || '',
    time: row.time || '',
    location_type: row.location_type || 'online',
    location_address: row.location_address || '',
    description: row.description || '',
    category: row.category || '',
    capacity: Number(row.capacity || 0),
    paid_event: Boolean(row.paid_event),
    tags: Array.isArray(row.tags) ? row.tags : [],
    attendees_count: Number(row.attendees_count || 0),
  }
}

export default function Events() {
  const toast = useToast()
  const [events, setEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [openMenuId, setOpenMenuId] = useState(null)
  const [attendeeEvent, setAttendeeEvent] = useState(null)
  const [attendees, setAttendees] = useState([])
  const [attendeesLoading, setAttendeesLoading] = useState(false)

  const [recordingEvent, setRecordingEvent] = useState(null)
  const [recordingDraft, setRecordingDraft] = useState('')
  const [recordingLinks, setRecordingLinks] = useState({})

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
      const res = await listEvents({ page: targetPage, q: searchTerm })
      const list = Array.isArray(res?.events) ? res.events : []
      setEvents(list.map(normalizeEvent))
      setPage(Number(res?.page || targetPage) || targetPage)
      setPageSize(Number(res?.pageSize || 20) || 20)
      setTotal(Number(res?.total || 0) || 0)
    } catch (err) {
      setEvents([])
      setTotal(0)
      setError(err?.message || 'Failed to load events')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      refresh()
    }, searchTerm ? 300 : 0)
    return () => window.clearTimeout(timeoutId)
  }, [page, searchTerm])

  const openAttendees = async (evt) => {
    setAttendeeEvent(evt)
    setAttendees([])
    setAttendeesLoading(true)
    try {
      const res = await getEventAttendees(evt.id)
      setAttendees(Array.isArray(res?.attendees) ? res.attendees : [])
    } catch (err) {
      toast.error(err?.message || 'Failed to load attendees')
    } finally {
      setAttendeesLoading(false)
    }
  }

  const openRecording = (evt) => {
    setRecordingEvent(evt)
    setRecordingDraft(recordingLinks[evt.id] || '')
  }

  const saveRecording = () => {
    if (!recordingEvent?.id) return
    const url = String(recordingDraft || '').trim()
    setRecordingLinks((prev) => ({ ...prev, [recordingEvent.id]: url }))
    setRecordingEvent(null)
    setRecordingDraft('')
  }

  const handleSave = async (eventData) => {
    setError('')
    setIsSaving(true)
    try {
      const user = readUser()
      const createdBy = Number(user?.id)
      if (!Number.isFinite(createdBy) || createdBy <= 0) {
        throw new Error('Missing logged-in user')
      }

      if (editingEvent) {
        await updateEvent(editingEvent.id, { ...eventData, created_by: createdBy })
        await refresh()
        toast.success('Event updated successfully.')
        return
      }

      await createEvent({ ...eventData, created_by: createdBy })
      await refresh({ nextPage: 1 })
      toast.success('Event created successfully.')
    } catch (err) {
      const message = err?.message || 'Failed to save event'
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editingEvent?.id) return
    setError('')
    setIsDeleting(true)
    try {
      await deleteEvent(editingEvent.id)
      await refresh()
      toast.success('Event deleted successfully.')
    } catch (err) {
      const message = err?.message || 'Failed to delete event'
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setIsDeleting(false)
    }
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

        {error ? (
          <section className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</section>
        ) : null}

        <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {isLoading ? (
            <section className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
              Loading events...
            </section>
          ) : null}
          {events.map((evt) => (
            <section key={evt.id} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">{evt.title}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill variant={evt.location_type}>{evt.location_type === 'online' ? 'Virtual' : 'In-Person'}</Pill>
                    <Pill variant="category">{evt.category}</Pill>
                    {evt.paid_event ? <Pill variant="category">Paid</Pill> : <Pill variant="category">Free</Pill>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation()
                      openRecording(evt)
                    }}
                  >
                    <Link2 className="h-4 w-4" />
                    URL recording
                  </button>

                  <div
                    className="relative"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <button
                      type="button"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-amber-600 hover:to-amber-700"
                      onClick={() => setOpenMenuId((prev) => (prev === evt.id ? null : evt.id))}
                    >
                      Actions
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {openMenuId === evt.id ? (
                      <div className="absolute right-0 top-full z-10 mt-2 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                        <button
                          type="button"
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            setOpenMenuId(null)
                            openAttendees(evt)
                          }}
                        >
                          View attendees
                        </button>
                        <button
                          type="button"
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            setOpenMenuId(null)
                            setEditingEvent(evt)
                            setShowCreateModal(true)
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-600">{evt.description}</p>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {formatDate(evt.date)} • {formatTime(evt.time)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {evt.location_address}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Users className="h-4 w-4 text-gray-400" />
                  {Number(evt.attendees_count || 0)}/{evt.capacity} attendees
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Eye className="h-4 w-4 text-gray-400" />
                  Landing Preview
                </div>
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

        <section className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-sm text-gray-600">
            Showing page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>
      </section>

      {showCreateModal ? (
        <CreateEditEvent
          mode={editingEvent ? 'edit' : 'create'}
          event={editingEvent}
          onClose={() => {
            setShowCreateModal(false)
            setEditingEvent(null)
          }}
          onSave={handleSave}
          onDelete={editingEvent ? handleDelete : undefined}
          isSaving={isSaving}
          isDeleting={isDeleting}
        />
      ) : null}

      {attendeeEvent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Attendees</h3>
                <p className="text-sm text-gray-500">{attendeeEvent.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setAttendeeEvent(null)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
              {attendeesLoading ? (
                <p className="text-sm text-gray-600">Loading attendees...</p>
              ) : attendees.length ? (
                <div className="space-y-3">
                  {attendees.map((attendee) => (
                    <section key={attendee.id} className="rounded-lg border border-gray-100 p-4">
                      <p className="font-medium text-gray-900">{attendee.name}</p>
                      <p className="text-sm text-gray-600">{attendee.email}</p>
                      <p className="text-sm text-gray-500">{attendee.contact_number}</p>
                    </section>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No attendees yet.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {recordingEvent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Recording URL</h3>
              <p className="text-sm text-gray-500">{recordingEvent.title}</p>
            </div>
            <div className="space-y-4 px-6 py-4">
              <input
                type="url"
                value={recordingDraft}
                onChange={(e) => setRecordingDraft(e.target.value)}
                placeholder="https://"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRecordingEvent(null)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveRecording}
                  className="rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm text-white hover:from-amber-600 hover:to-amber-700"
                >
                  Save URL
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function Pill({ children, variant }) {
  const base = 'rounded-full px-3 py-1 text-xs font-medium'
  const styles =
    variant === 'online'
      ? 'bg-blue-100 text-blue-700'
      : variant === 'in person'
        ? 'bg-emerald-100 text-emerald-700'
        : 'bg-amber-100 text-amber-700'
  return <span className={`${base} ${styles}`}>{children}</span>
}
