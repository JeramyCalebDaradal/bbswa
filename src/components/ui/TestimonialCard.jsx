import { images } from '../../assets/images'

function StarRating() {
  return (
    <div className="flex gap-1.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <img key={i} src={images.star} alt="" className="size-5 sm:size-6" />
      ))}
    </div>
  )
}

export default function TestimonialCard({ quote, name, role, avatar }) {
  return (
    <article className="relative flex h-full flex-col gap-5 rounded-lg bg-bbs-card p-6 shadow-md sm:p-7">
      <img src={images.quote} alt="" className="size-7 sm:size-8" />
      <p className="flex-1 text-sm leading-relaxed text-bbs-muted sm:text-base">{quote}</p>
      <div className="flex items-center gap-4">
        <img src={avatar} alt={name} className="size-20 rounded-full object-cover sm:size-24" />
        <div>
          <StarRating />
          <p className="mt-2 font-bold text-bbs-dark">{name}</p>
          <p className="text-sm text-bbs-muted">| {role}</p>
        </div>
      </div>
    </article>
  )
}
