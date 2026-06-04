import { images } from '../../assets/images'

const hoverCardClassName = ''

export function EventMetaRow({ icon, iconClassName = '', textClassName = '', children }) {
  return (
    <div className="flex items-start gap-3">
      <img src={icon} alt="" className={`mt-0.5 h-5 w-5 shrink-0 object-contain ${iconClassName}`} />
      <div className={`text-sm leading-5 text-[#4A5565] ${textClassName}`}>{children}</div>
    </div>
  )
}

export function EventTag({ children, variant = 'muted' }) {
  const className =
    variant === 'blue'
      ? 'bg-[#DBEAFE] text-[#1447E6]'
      : variant === 'purple'
        ? 'bg-[#F3E8FF] text-[#8200DB]'
        : 'bg-[#F3F4F6] text-[#4A5565]'

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-normal leading-4 ${className}`}>
      {children}
    </span>
  )
}

export function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex w-full cursor-pointer items-center justify-center rounded-[10px] bg-bbs-orange px-5 py-3 text-sm font-semibold leading-5 text-white transition-colors hover:bg-[#e69700] ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function GhostActionButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex cursor-pointer items-center gap-2 text-sm font-semibold leading-5 text-bbs-orange hover:underline ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function EventCard({
  image,
  imageBadge,
  tags = [],
  title,
  description,
  date,
  time,
  location,
  attendees,
  actionLabel,
  onAction,
  variant = 'standard',
}) {
  const isFeatured = variant === 'featured'

  return (
    <article
      className={`${hoverCardClassName} overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]`}
    >
      <div className={isFeatured ? 'grid gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]' : ''}>
        <div className={isFeatured ? 'relative aspect-[16/9] lg:aspect-auto lg:h-full' : 'relative aspect-[16/9]'}>
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          {imageBadge ? (
            <div className="absolute right-4 top-4 rounded bg-white/90 px-3 py-1 text-xs font-semibold leading-4 text-[#101828]">
              {imageBadge}
            </div>
          ) : null}
        </div>

        <div className={isFeatured ? 'p-5 sm:p-6' : 'p-5'}>
          {tags.length ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <EventTag key={tag.label} variant={tag.variant}>
                  {tag.label}
                </EventTag>
              ))}
            </div>
          ) : null}

          <h3 className="mt-4 text-xl font-semibold leading-7 text-[#101828]">{title}</h3>
          <p className="mt-3 text-sm leading-5 text-[#4A5565]">{description}</p>

          <div className="mt-5 space-y-3">
            <EventMetaRow icon={images.eventsPage.icons.calendar}>{date}</EventMetaRow>
            <EventMetaRow icon={images.eventsPage.icons.clock}>{time}</EventMetaRow>
            <EventMetaRow icon={images.eventsPage.icons.location}>{location}</EventMetaRow>
            {attendees ? <EventMetaRow icon={images.eventsPage.icons.users}>{attendees}</EventMetaRow> : null}
          </div>

          <div className="mt-6">
            <PrimaryButton onClick={onAction}>{actionLabel}</PrimaryButton>
          </div>
        </div>
      </div>
    </article>
  )
}

export function PastEventCard({ title, date, attendees, onWatch }) {
  const mutedIconClassName = 'opacity-60 grayscale'

  return (
    <article
      className={`${hoverCardClassName} rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] p-5 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] sm:p-6`}
    >
      <h3 className="text-lg font-semibold leading-7 text-[#101828]">{title}</h3>

      <div className="mt-4 space-y-3">
        <EventMetaRow
          icon={images.eventsPage.icons.calendar}
          iconClassName={mutedIconClassName}
        >
          {date}
        </EventMetaRow>
        <EventMetaRow
          icon={images.eventsPage.icons.users}
          iconClassName={mutedIconClassName}
        >
          {attendees}
        </EventMetaRow>
      </div>

      <div className="mt-5 flex justify-center">
        <GhostActionButton onClick={onWatch}>
          <img src={images.eventsPage.icons.play} alt="" className="h-4 w-4 object-contain" />
          Watch Recording
          <img src={images.eventsPage.icons.arrowRight} alt="" className="h-4 w-4 object-contain" />
        </GhostActionButton>
      </div>
    </article>
  )
}
