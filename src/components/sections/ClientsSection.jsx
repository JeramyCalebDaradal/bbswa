import Section from '../layout/Section'
import SectionHeading from '../ui/SectionHeading'
import { clientIndustries } from '../../data/homeContent'

function ClientIcon({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <img src={icon} alt="" className="size-14 object-contain sm:size-16 md:size-[72px]" />
      <p className="text-sm font-semibold text-bbs-muted sm:text-base">{label}</p>
    </div>
  )
}

export default function ClientsSection() {
  return (
    <Section className="bg-bbs-surface py-[66px] sm:py-[90px]">
      <SectionHeading title="Our Clients" className="mb-6" />
      <p className="mb-10 max-w-5xl text-base leading-relaxed text-bbs-muted sm:text-lg">
        Our clients are the majority of government agencies, conglomerates or private businesses and
        renowned personalities. Our platforms and multidisciplinary services spans across all industry
        verticals and geographies. We value our client&apos;s privacy and NDA, hence here are some brief
        descriptions of our previous engagements:
      </p>

      <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
        {clientIndustries.map((client) => (
          <ClientIcon key={client.label} {...client} />
        ))}
      </div>
    </Section>
  )
}
