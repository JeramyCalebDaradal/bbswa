import AccentUnderline from './AccentUnderline'

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  align = 'left',
  className = '',
  titleClassName = '',
}) {
  const alignClass =
    align === 'center' ? 'text-center items-center' : 'text-left items-start'

  const renderTitle = () => {
    if (!highlight) {
      return <h2 className={`text-3xl font-bold text-bbs-dark sm:text-4xl ${titleClassName}`}>{title}</h2>
    }

    const [before, after] = title.split(highlight)
    return (
      <h2 className={`text-3xl font-bold text-bbs-dark sm:text-4xl ${titleClassName}`}>
        {before}
        <span className="text-bbs-orange">{highlight}</span>
        {after}
      </h2>
    )
  }

  return (
    <div className={`flex flex-col gap-2 ${alignClass} ${className}`}>
      {eyebrow && (
        <p className="text-sm font-bold uppercase tracking-wide text-bbs-orange sm:text-base">{eyebrow}</p>
      )}
      {renderTitle()}
      <AccentUnderline className="mt-1" />
    </div>
  )
}
