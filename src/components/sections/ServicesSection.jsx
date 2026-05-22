import Section from '../layout/Section'
import SectionHeading from '../ui/SectionHeading'
import ServiceCard from '../ui/ServiceCard'
import { services } from '../../data/homeContent'
import { images } from '../../assets/images'

export default function ServicesSection() {
  return (
    <Section
      id="services"
      disableContainer
      className="relative overflow-hidden bg-black py-14 text-white sm:py-20"
    >
      <div className="absolute inset-0 opacity-30">
        <img src={images.globe} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading title="Services" titleClassName="!text-white" className="!items-start" />
          <a href="#" className="text-lg font-medium text-bbs-orange hover:underline sm:text-xl">
            View all
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.code} {...service} />
          ))}
        </div>
      </div>
    </Section>
  )
}
