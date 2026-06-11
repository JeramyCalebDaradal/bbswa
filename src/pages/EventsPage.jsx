import { useEffect, useMemo, useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import AccentUnderline from '../components/ui/AccentUnderline'
import Section from '../components/layout/Section'
import { images } from '../assets/images'
import { EventCard, PastEventCard } from '../components/ui/EventsComponents'
import { listPublicEvents, registerForEvent } from '../api/events'
import { useToast } from '../components/ui/useToast'

function formatDate(dateValue) {
  if (!dateValue) return ''
  const d = dateValue instanceof Date ? dateValue : new Date(dateValue)
  if (Number.isNaN(d.getTime())) return String(dateValue)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function formatTime(timeString) {
  const [hours, minutes] = String(timeString || '').split(':')
  const hour = Number.parseInt(hours || '0', 10)
  const minute = Number.parseInt(minutes || '0', 10)
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return String(timeString || '')
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${String(minute).padStart(2, '0')} ${ampm}`
}

export default function EventsPage() {
  const toast = useToast()
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [registerEvent, setRegisterEvent] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [registerError, setRegisterError] = useState('')

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      setError('')
      setIsLoading(true)
      try {
        const res = await listPublicEvents()
        setEvents(Array.isArray(res?.events) ? res.events : [])
      } catch (err) {
        setError(err?.message || 'Failed to load events')
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  const { upcomingEvents, featuredEvent, pastEvents } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const upcoming = []
    const past = []

    for (const evt of events) {
      const d = new Date(evt?.date)
      if (Number.isNaN(d.getTime())) continue
      d.setHours(0, 0, 0, 0)
      if (d >= today) upcoming.push(evt)
      else past.push(evt)
    }

    const upcomingByNewestAdded = [...upcoming].sort((a, b) => Number(b?.id || 0) - Number(a?.id || 0))
    const featured = upcomingByNewestAdded[0] || null
    const upcomingRest = featured ? upcomingByNewestAdded.slice(1) : []

    const pastByNewestDate = [...past].sort((a, b) => {
      const ad = new Date(a?.date).getTime()
      const bd = new Date(b?.date).getTime()
      if (ad !== bd) return bd - ad
      return Number(b?.id || 0) - Number(a?.id || 0)
    })

    return { upcomingEvents: upcomingRest, featuredEvent: featured, pastEvents: pastByNewestDate }
  }, [events])

  const upcomingFallbackImages = useMemo(
    () => [
      images.eventsPage.upcoming.cybersecuritySummit,
      images.eventsPage.upcoming.cloudWebinar,
      images.eventsPage.upcoming.networkWorkshop,
      images.eventsPage.upcoming.digitalRoundtable,
    ],
    []
  )

  const mapEventToCard = (evt, index, variant) => {
    const img = String(evt?.preview_image || '').trim() || upcomingFallbackImages[index % upcomingFallbackImages.length]
    const isOnline = String(evt?.location_type || '').toLowerCase() === 'online'
    const badge = isOnline ? 'Virtual' : 'In-Person'
    const tags = [{ label: evt.category, variant: isOnline ? 'blue' : 'purple' }]
    return {
      image: img,
      imageBadge: badge,
      tags,
      title: evt.title,
      description: evt.description,
      date: formatDate(evt.date),
      time: formatTime(evt.time),
      location: isOnline ? 'Online' : evt.location_address,
      attendees: `${Number(evt.attendees_count || 0)} attendees`,
      actionLabel: 'Register',
      onAction: () => {
        setRegisterError('')
        setRegisterEvent(evt)
      },
      variant,
    }
  }

  const submitRegistration = async () => {
    if (!registerEvent?.id) return
    setRegisterError('')

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      contact_number: contactNumber,
    }

    setIsRegistering(true)
    try {
      await registerForEvent(registerEvent.id, payload)
      setRegisterEvent(null)
      toast.success('Registration successful.')
      setEvents((prev) =>
        prev.map((e) =>
          e.id === registerEvent.id ? { ...e, attendees_count: Number(e.attendees_count || 0) + 1 } : e
        )
      )
      setFirstName('')
      setLastName('')
      setEmail('')
      setContactNumber('')
    } catch (err) {
      const message = err?.message || 'Registration failed'
      setRegisterError(message)
      toast.error(message)
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <>
      <main>
        <section className="relative h-[507px] overflow-hidden bg-black text-white">
          <div className="absolute inset-0">
            <img src={images.eventsPage.heroBg} alt="" className="h-full w-full object-cover opacity-55" />
          </div>

          <div className="relative flex h-full flex-col">
            <Header overlay />
            <div className="flex flex-1 items-center justify-center">
              <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-5 sm:px-8 lg:px-12">
                <h1 className="text-4xl font-bold sm:text-5xl">Events</h1>
                <AccentUnderline className="mt-3 w-24 sm:w-28" />
                <Breadcrumbs
                  className="mt-4"
                  items={[
                    { label: 'Home', to: '/' },
                    { label: 'Events' },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        <Section className="bg-white" containerClassName="pt-12 pb-20 sm:pt-16 sm:pb-20">
          <section>
            <h2 className="text-3xl font-bold text-[#101828] sm:text-4xl">Upcoming Events</h2>
            <p className="mt-3 text-base leading-6 text-[#4A5565] sm:text-lg">
              Register now to secure your spot
            </p>

            <div className="mt-8 grid gap-6">
              {error ? (
                <section className="rounded-[10px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</section>
              ) : null}

              {isLoading ? (
                <section className="rounded-[10px] border border-gray-200 bg-white p-6 text-sm text-gray-600">
                  Loading events...
                </section>
              ) : null}

              {!isLoading && !error && !featuredEvent ? (
                <section className="rounded-[10px] border border-gray-200 bg-white p-6 text-sm text-gray-600">
                  No upcoming events yet.
                </section>
              ) : null}

              {featuredEvent ? <EventCard {...mapEventToCard(featuredEvent, 0, 'featured')} /> : null}

              {upcomingEvents.length ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingEvents.map((event, idx) => (
                    <EventCard key={event.id} {...mapEventToCard(event, idx + 1, 'standard')} />
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        </Section>

        {pastEvents.length ? (
          <Section className="bg-white" containerClassName="pt-0 pb-20 sm:pb-20">
            <section>
              <h2 className="text-3xl font-bold text-[#101828] sm:text-4xl">Past Events</h2>
              <p className="mt-3 text-base leading-6 text-[#4A5565] sm:text-lg">
                Access recordings and materials from previous events
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <PastEventCard
                    key={event.id}
                    title={event.title}
                    date={formatDate(event.date)}
                    attendees={`${Number(event.attendees_count || 0)} attendees`}
                    onWatch={() => {}}
                  />
                ))}
              </div>
            </section>
          </Section>
        ) : null}
      </main>

      {registerEvent ? (
        <section className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => (isRegistering ? null : setRegisterEvent(null))}
            aria-label="Close"
          />
          <section className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <section className="flex items-start justify-between gap-4">
              <section>
                <h3 className="text-xl font-semibold text-gray-900">Register for event</h3>
                <p className="mt-1 text-sm text-gray-600">{registerEvent.title}</p>
              </section>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => setRegisterEvent(null)}
                disabled={isRegistering}
                aria-label="Close"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </section>

            <section className="mt-5 space-y-4">
              {registerError ? (
                <section className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {registerError}
                </section>
              ) : null}

              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <section>
                  <label className="mb-2 block text-sm font-medium text-gray-700">First name</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isRegistering}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FD9D0F]"
                  />
                </section>
                <section>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Last name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isRegistering}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FD9D0F]"
                  />
                </section>
              </section>

              <section>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isRegistering}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FD9D0F]"
                />
              </section>

              <section>
                <label className="mb-2 block text-sm font-medium text-gray-700">Contact number</label>
                <input
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  disabled={isRegistering}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FD9D0F]"
                />
              </section>

              <section className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => setRegisterEvent(null)}
                  disabled={isRegistering}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="cursor-pointer rounded-lg bg-[#FD9D0F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#ffb13b] disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={submitRegistration}
                  disabled={isRegistering}
                >
                  {isRegistering ? 'Registering...' : 'Register'}
                </button>
              </section>
            </section>
          </section>
        </section>
      ) : null}

      <Footer />
    </>
  )
}
