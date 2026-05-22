import Section from '../layout/Section'
import SectionHeading from '../ui/SectionHeading'
import FeatureCard from '../ui/FeatureCard'
import { aboutFeatures } from '../../data/homeContent'

export default function AboutSection() {
  return (
    <Section id="about" className="bg-white py-14 sm:py-20">
      <SectionHeading title="About Us" className="mb-6" />
      <p className="mb-10 max-w-4xl text-base leading-relaxed text-bbs-muted sm:text-lg">
        From digital forensics to disaster recovery planning, we empower clients with comprehensive
        solutions for peace of mind in a dynamic world.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        {aboutFeatures.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </Section>
  )
}
