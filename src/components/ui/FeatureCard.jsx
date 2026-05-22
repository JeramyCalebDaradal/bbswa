import { images } from '../../assets/images'

export default function FeatureCard({ title, items, icon }) {
  return (
    <article className="flex h-full flex-col gap-5 rounded-[30px] border border-white/20 bg-black px-6 py-[29px] text-white shadow-md sm:flex-row sm:items-start sm:gap-6 sm:px-7 sm:py-[33px]">
      <div className="relative flex size-24 shrink-0 items-center justify-center sm:size-28">
        <div className="absolute inset-0 rounded-full bg-bbs-orange" aria-hidden="true" />
        <img src={icon} alt="" className="relative z-10 size-14 object-contain sm:size-16" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-base font-bold sm:text-lg">{title}</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-white/90 sm:text-base">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export function CheckIcon() {
  return <img src={images.check} alt="" className="size-12 shrink-0 sm:size-14" />
}
