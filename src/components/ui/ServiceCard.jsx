export default function ServiceCard({ code, title, description, icon }) {
  return (
    <article className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-md sm:p-6">
      <div className="mb-4 flex items-center gap-4">
        <img src={icon} alt="" className="size-14 shrink-0 object-contain sm:size-16" />
        <h3 className="text-xl font-bold text-bbs-orange sm:text-2xl">{code}</h3>
      </div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-bbs-muted sm:text-sm">{title}</p>
      <p className="text-sm leading-relaxed text-bbs-muted">{description}</p>
    </article>
  )
}
