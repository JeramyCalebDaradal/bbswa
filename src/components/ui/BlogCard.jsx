import { images } from '../../assets/images'

export default function BlogCard({ title, date, author, image }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md pb-5">
      <div className="aspect-[16/10] overflow-hidden border-b border-gray-200">
        <img src={image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-4 pt-4 pb-[30px] sm:px-5 sm:pt-5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold uppercase text-bbs-muted sm:text-sm">
          <span className="inline-flex items-center gap-2">
            <img src={images.blogCalendar} alt="" className="size-4 sm:size-4" />
            {date}
          </span>
          <span className="inline-flex items-center gap-2">
            <img src={images.blogUser} alt="" className="size-4 sm:size-4" />
            By <span className="text-bbs-orange">{author}</span>
          </span>
        </div>
        <h3 className="text-base font-bold mt-5 leading-snug text-bbs-muted sm:text-lg">{title}</h3>
      </div>
    </article>
  )
}
