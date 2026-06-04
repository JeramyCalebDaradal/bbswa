import { useMemo } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import AccentUnderline from '../components/ui/AccentUnderline'
import Section from '../components/layout/Section'
import { images } from '../assets/images'
import { EventCard, PastEventCard } from '../components/ui/EventsComponents'

export default function EventsPage() {
  const upcomingEvents = useMemo(
    () => [
      {
        variant: 'featured',
        imageBadge: 'Featured Event',
        image: images.eventsPage.upcoming.cybersecuritySummit,
        tags: [
          { label: 'Conference', variant: 'blue' },
          { label: 'In-Person', variant: 'purple' },
        ],
        title: 'Cybersecurity Summit 2026',
        description:
          'Join industry leaders for a full-day conference on the latest cybersecurity trends and best practices.',
        date: 'June 15, 2026',
        time: '9:00 AM - 5:00 PM EST',
        location: 'New York Convention Center',
        attendees: '500 attendees expected',
        actionLabel: 'Register Now',
      },
      {
        image: images.eventsPage.upcoming.cloudWebinar,
        imageBadge: 'Virtual',
        tags: [{ label: 'Webinar', variant: 'blue' }],
        title: 'Cloud Infrastructure Webinar',
        description: 'Learn how to optimize your cloud infrastructure for maximum efficiency and cost savings.',
        date: 'June 8, 2026',
        time: '2:00 PM - 3:30 PM EST',
        location: 'Online',
        actionLabel: 'Register',
      },
      {
        image: images.eventsPage.upcoming.networkWorkshop,
        imageBadge: 'In-Person',
        tags: [{ label: 'Workshop', variant: 'blue' }],
        title: 'Network Security Workshop',
        description:
          'Hands-on workshop covering advanced network security configurations and threat detection.',
        date: 'June 22, 2026',
        time: '10:00 AM - 4:00 PM EST',
        location: 'Black Bear Training Center, Boston',
        actionLabel: 'Register',
      },
      {
        image: images.eventsPage.upcoming.digitalRoundtable,
        imageBadge: 'Virtual',
        tags: [{ label: 'Roundtable', variant: 'blue' }],
        title: 'Digital Transformation Roundtable',
        description:
          'Interactive discussion with CTOs and IT leaders on successful digital transformation strategies.',
        date: 'June 29, 2026',
        time: '1:00 PM - 2:30 PM EST',
        location: 'Online',
        actionLabel: 'Register',
      },
    ],
    []
  )

  const pastEvents = useMemo(
    () => [
      { title: 'Enterprise Security Conference 2026', date: 'May 10, 2026', attendees: '450 attendees' },
      { title: 'DevOps Best Practices Webinar', date: 'April 25, 2026', attendees: '320 attendees' },
      { title: 'AI in Cybersecurity Panel', date: 'April 12, 2026', attendees: '280 attendees' },
    ],
    []
  )

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
              <EventCard {...upcomingEvents[0]} />
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.slice(1).map((event) => (
                  <EventCard key={event.title} {...event} />
                ))}
              </div>
            </div>
          </section>
        </Section>

        <Section className="bg-white" containerClassName="pt-0 pb-20 sm:pb-20">
          <section>
            <h2 className="text-3xl font-bold text-[#101828] sm:text-4xl">Past Events</h2>
            <p className="mt-3 text-base leading-6 text-[#4A5565] sm:text-lg">
              Access recordings and materials from previous events
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <PastEventCard key={event.title} {...event} />
              ))}
            </div>
          </section>
        </Section>
      </main>
      <Footer />
    </>
  )
}
