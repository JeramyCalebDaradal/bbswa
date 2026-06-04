import { images } from '../../assets/images'

export function FilterPill({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[42px] cursor-pointer rounded-[10px] px-4 text-base font-medium leading-6 transition-colors ${
        active ? 'bg-[#FD9D0F] text-white' : 'border border-[#D1D5DC] bg-white text-[#364153]'
      }`}
    >
      {children}
    </button>
  )
}

export function DepartmentBadge({ children }) {
  return (
    <span className="inline-flex rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-normal leading-4 text-[#1447E6]">
      {children}
    </span>
  )
}

export function CareerPerkCard({ icon, title, description }) {
  return (
    <article className="flex flex-col items-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFEDD4]">
        <img src={icon} alt="" className="h-6 w-6 object-contain" />
      </div>
      <h3 className="mt-6 text-lg font-semibold leading-7 text-[#101828]">{title}</h3>
      <p className="mt-2 text-sm leading-5 text-[#4A5565]">{description}</p>
    </article>
  )
}

export function JobMeta({ icon, children }) {
  return (
    <div className="flex items-center gap-2">
      <img src={icon} alt="" className="h-4 w-4 object-contain opacity-70" />
      <span className="text-sm leading-5 text-[#6A7282]">{children}</span>
    </div>
  )
}

export function ApplyNowButton({ children = 'Apply Now', onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-[42px] cursor-pointer whitespace-nowrap rounded-[10px] bg-[#FD9D0F] px-4 text-base font-medium leading-6 text-white hover:bg-[#ffb13b]"
    >
      {children}
    </button>
  )
}

export function JobCard({
  title,
  department,
  description,
  location,
  employmentType,
  posted,
  onApply,
}) {
  return (
    <article className="rounded-[10px] border border-[#E5E7EB] bg-white p-6 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold leading-7 text-[#101828]">{title}</h3>
            <DepartmentBadge>{department}</DepartmentBadge>
          </div>
          <p className="mt-3 text-base leading-6 text-[#4A5565]">{description}</p>
        </div>

        <div className="shrink-0">
          <ApplyNowButton onClick={onApply} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
        <JobMeta icon={images.careerPage.icons.location}>{location}</JobMeta>
        <JobMeta icon={images.careerPage.icons.briefcase}>{employmentType}</JobMeta>
        <JobMeta icon={images.careerPage.icons.clock}>{posted}</JobMeta>
      </div>
    </article>
  )
}
