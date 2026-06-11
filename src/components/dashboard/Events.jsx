import { useEffect, useMemo, useState } from 'react'
import { Calendar, ChevronDown, Eye, MapPin, Paperclip, Plus, Search, Users } from 'lucide-react'
import CreateEditEvent from './CreateEditEvent'
import EventAttendeesModal from './EventAttendeesModal'
import { createEvent, getEventAttendees, listEvents, updateEvent } from '../../api/events'
import { readUser } from '../../auth/session'

function formatDate(dateString) {
  const date = dateString instanceof Date ? dateString : new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
      : variant === 'in person'
        ? 'bg-purple-100 text-purple-700'
        : 'bg-amber-100 text-amber-700'
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles}`}>{children}</span>
}

export default function Events() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [attendeesEvent, setAttendeesEvent] = useState(null)
  const [attendees, setAttendees] = useState([])
  const [attendeesError, setAttendeesError] = useState('')
  const [isAttendeesLoading, setIsAttendeesLoading] = useState(false)
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
      setEvents(Array.isArray(res?.events) ? res.events : [])
      setPage(Number(res?.page || targetPage) || targetPage)
      setPageSize(Number(res?.pageSize || 20) || 20)
      setTotal(Number(res?.total || 0) || 0)
    } catch (err) {
      setError(err?.message || 'Failed to load events')
      setEvents([])
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
  }, [page, searchTerm])

  useEffect(() => {
    if (!openMenuId) return
    const onDocClick = () => setOpenMenuId(null)
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [openMenuId])

  const fetchAttendees = async (eventId) => {
    setAttendeesError('')
    setIsAttendeesLoading(true)
    try {
      const res = await getEventAttendees(eventId)
      setAttendees(Array.isArray(res?.attendees) ? res.attendees : [])
    } catch (err) {
      setAttendeesError(err?.message || 'Failed to load attendees')
      setAttendees([])
    } finally {
      setIsAttendeesLoading(false)
    }
  }

  const openAttendees = (evt) => {
    setAttendeesEvent(evt)
    setAttendees([])
    setAttendeesError('')
    fetchAttendees(evt.id)
  }

  const openRecording = (evt) => {
    setRecordingEvent(evt)
    const existing = recordingLinks?.[evt.id]
    setRecordingDraft(typeof existing === 'string' ? existing : '')
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
      const createdBy = user?.id
      if (!createdBy) {
        throw new Error('Missing logged-in user')
      }

      if (editingEvent) {
        await updateEvent(editingEvent.id, { ...eventData, created_by: createdBy })
        await refresh()
        return
      }

      await createEvent({ ...eventData, created_by: createdBy })
      await refresh({ nextPage: 1 })
    } finally {
      setIsSaving(false)
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
                    <Paperclip className="h-4 w-4" />
                    Attach recording
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
                {recordingLinks?.[evt.id] ? (
                  <a
                    href={recordingLinks[evt.id]}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                  >
                    Recording
                  </a>
                ) : null}
              </div>
            </section>
          ))}
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

      <EventAttendeesModal
        open={Boolean(attendeesEvent)}
        eventTitle={attendeesEvent?.title}
        attendees={attendees}
        isLoading={isAttendeesLoading}
        error={attendeesError}
        onClose={() => {
          setAttendeesEvent(null)
          setAttendees([])
          setAttendeesError('')
        }}
        onRefresh={() => (attendeesEvent?.id ? fetchAttendees(attendeesEvent.id) : null)}
      />

      {recordingEvent ? (
        <section className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setRecordingEvent(null)}
            aria-label="Close"
          />
          <section className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <section className="flex items-start justify-between gap-4">
              <section>
                <h3 className="text-xl font-semibold text-gray-900">Attach recording</h3>
                <p className="mt-1 text-sm text-gray-600">{recordingEvent.title}</p>
              </section>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={() => setRecordingEvent(null)}
                aria-label="Close"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </section>

            <section className="mt-5 space-y-4">
              <section>
                <label className="mb-2 block text-sm font-medium text-gray-700">Recording link</label>
                <input
                  type="url"
                  value={recordingDraft}
                  onChange={(e) => setRecordingDraft(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="mt-2 text-xs text-gray-500">Paste a link to the recording (Zoom, YouTube, Drive, etc.).</p>
              </section>

              <section className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  onClick={() => setRecordingEvent(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="cursor-pointer rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-amber-600 hover:to-amber-700"
                  onClick={saveRecording}
                >
                  Save
                </button>
              </section>
            </section>
          </section>
        </section>
      ) : null}

      {showCreateModal ? (
        <CreateEditEvent
          mode={editingEvent ? 'edit' : 'create'}
          event={
            editingEvent
              ? {
                  ...editingEvent,
                  tags: Array.isArray(editingEvent.tags) ? editingEvent.tags.join(', ') : '',
                }
              : undefined
          }
          onSave={handleSave}
          isSaving={isSaving}
          onClose={() => {
            setShowCreateModal(false)
            setEditingEvent(null)
          }}
        />
      ) : null}
    </>
  )
}
