import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items, className = '' }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-white/90 sm:text-base">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              {item.to && !isLast ? (
                <Link to={item.to} className="transition-colors hover:text-bbs-orange">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-bbs-orange' : ''}>{item.label}</span>
              )}
              {!isLast && <span className="text-white/60">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
