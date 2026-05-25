import Section from '../layout/Section'
import SectionHeading from '../ui/SectionHeading'
import ServiceCard from '../ui/ServiceCard'
import { Link } from 'react-router-dom'
import { serviceTopics } from '../../data/servicesContent'
import { images } from '../../assets/images'

export default function ServicesSection() {
  return (
    <Section
      id="services"
      disableContainer
      className="relative overflow-hidden bg-black text-white py-18 sm:py-30"
    >
      <div className="absolute inset-0 opacity-30">
        <img src={images.globe} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading title="Services" titleClassName="!text-white" className="!items-start" />
          <Link to="/services" className="text-lg font-medium text-bbs-orange hover:underline sm:text-xl">
            View all
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {serviceTopics.slice(0, 6).map((service) => (
            <ServiceCard
              key={service.slug}
              code={service.code}
              title={service.title}
              description={service.summary}
              icon={service.icon}
              to={`/services/${service.slug}`}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}
