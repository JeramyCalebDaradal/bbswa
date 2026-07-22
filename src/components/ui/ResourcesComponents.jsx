import { images } from '../../assets/images'
import { Link } from 'react-router-dom'

const hoverCardClassName =
  'cursor-pointer transition-transform transition-shadow duration-200 hover:translate-y-[-2px] hover:shadow-[0px_6px_18px_rgba(0,0,0,0.12)]'

export function MasonryColumns({ children, className = '' }) {
  return <div className={`columns-1 [column-gap:24px] sm:columns-2 lg:columns-3 ${className}`}>{children}</div>
}

export function ResourceTypeTab({
  active,
  icon,
  label,
  onClick,
  iconClassName = '',
  iconMaskSize = 'contain',
}) {
  const iconColor = active ? '#FF6900' : '#4A5565'

  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex cursor-pointer items-center gap-2 text-left"
    >
      <span
        aria-hidden="true"
        className={`h-[15px] w-[15px] shrink-0 sm:h-[18px] sm:w-[18px] ${iconClassName}`}
        style={{
          backgroundColor: iconColor,
          WebkitMaskImage: `url(${icon})`,
          maskImage: `url(${icon})`,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          WebkitMaskSize: iconMaskSize,
          maskSize: iconMaskSize,
        }}
      />
      <span
        className={`text-sm font-medium leading-4 transition-colors sm:text-base sm:leading-5 ${
          active ? 'text-[#FF6900]' : 'text-[#4A5565] group-hover:text-[#FF6900]'
        }`}
      >
        {label}
      </span>
    </button>
  )
}

export function ResourceArticleCard({ tag, date, readTime, title, description, to }) {
  return (
    <article
      className={`${hoverCardClassName} rounded-[10px] bg-white p-6 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex flex-wrap items-center gap-3 text-sm leading-5 text-[#6A7282]">
          <span className="inline-flex items-center rounded-full bg-[#FFEDD4] px-3 py-1 text-sm leading-5 text-[#CA3500]">
            {tag}
          </span>
          <span>{date}</span>
          <span>{readTime}</span>
        </div>

        <div className="flex justify-start sm:justify-end">
          {to ? (
            <Link
              to={to}
              className="inline-flex h-10 w-[111px] cursor-pointer items-center justify-center rounded bg-[#FD9D0F] text-base font-medium leading-6 text-white transition-colors hover:bg-[#ffb13b]"
            >
              Read More
            </Link>
          ) : (
            <button
              type="button"
              className="h-10 w-[111px] cursor-pointer rounded bg-[#FD9D0F] text-base font-medium leading-6 text-white transition-colors hover:bg-[#ffb13b]"
            >
              Read More
            </button>
          )}
        </div>
      </div>

      <h3 className="mt-4 text-lg font-semibold leading-7 text-[#101828] sm:text-xl">{title}</h3>
      <p className="mt-2 text-base leading-6 text-[#4A5565]">{description}</p>
    </article>
  )
}

export function DatasheetCard({ icon, title, description, pages, size, month, filePath }) {
  const meta = [pages, size, month].filter(Boolean)
  const hasDownload = Boolean(filePath && String(filePath).trim())
  return (
    <article
      className={`${hoverCardClassName} mb-6 break-inside-avoid rounded-[10px] bg-white p-5 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] sm:p-6`}
    >
      <div className="flex items-start gap-4">
        <div className="w-fit shrink-0 rounded-[10px] bg-[#FFEDD4] p-3">
          <img src={icon} alt="" className="h-8 w-8 object-contain" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold leading-7 text-[#101828]">{title}</h3>
          <p className="mt-2 text-sm leading-5 text-[#4A5565]">{description}</p>

          {meta.length ? (
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm leading-4 text-[#6A7282]">
              {meta.map((item, idx) => (
                <span key={`${item}_${idx}`} className="inline-flex items-center gap-3">
                  <span>{item}</span>
                  {idx < meta.length - 1 ? <span aria-hidden="true">•</span> : null}
                </span>
              ))}
            </div>
          ) : null}

          {hasDownload ? (
            <a
              href={String(filePath)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm font-medium leading-5 text-[#FF6900] transition-colors hover:text-[#F54900] hover:underline"
            >
              <img src={images.resourcesPage.datasheets.downloadIcon} alt="" className="h-4 w-4 object-contain" />
              Download PDF
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export function VideoCard({ thumbnail, duration, title, description, filePath }) {
  const href = String(filePath || '').trim()
  const isClickable = Boolean(href)
  const Wrapper = isClickable ? 'a' : 'div'
  const wrapperProps = isClickable
    ? { href, target: '_blank', rel: 'noreferrer' }
    : {}
  return (
    <article className="mb-6 break-inside-avoid overflow-hidden rounded-[10px] bg-white shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
      <Wrapper
        {...wrapperProps}
        className={`${hoverCardClassName} block ${isClickable ? '' : 'cursor-default'}`}
      >
      <div className="relative aspect-[16/9] bg-[#E5E7EB]">
        <img src={thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" width="640" height="360" />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
            <img src={images.resourcesPage.videos.playIcon} alt="" className="h-5 w-5 object-contain" />
          </div>
        </div>

        {duration ? (
          <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs leading-4 text-white">
            {duration}
          </div>
        ) : null}
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="text-lg font-semibold leading-7 text-[#101828]">{title}</h3>
        <p className="mt-2 text-sm leading-5 text-[#4A5565]">{description}</p>
      </div>
      </Wrapper>
    </article>
  )
}

