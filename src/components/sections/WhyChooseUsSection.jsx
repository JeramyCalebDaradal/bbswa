import Section from '../layout/Section'
import SectionHeading from '../ui/SectionHeading'
import { CheckIcon } from '../ui/FeatureCard'
import { whyChooseUs } from '../../data/homeContent'

export default function WhyChooseUsSection() {
  return (
    <Section className="bg-white py-14 sm:py-20">
      <SectionHeading title="Why Choose Us?" align="center" className="mb-10 mx-auto" />

      <div className="grid gap-8 md:grid-cols-2">
        {whyChooseUs.map((item) => (
          <article key={item.title} className="flex gap-4">
            <CheckIcon />
            <div>
              <h3 className="text-lg font-bold text-bbs-muted sm:text-xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bbs-muted sm:text-base">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
