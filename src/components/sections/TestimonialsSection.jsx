import Section from '../layout/Section'
import SectionHeading from '../ui/SectionHeading'
import TestimonialCard from '../ui/TestimonialCard'
import { testimonials } from '../../data/homeContent'

export default function TestimonialsSection() {
  return (
    <Section className="bg-white py-14 sm:py-20">
      <SectionHeading
        eyebrow="Testimonial"
        title="What Clients Say"
        align="center"
        className="mb-10 mx-auto"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {testimonials.map((item, index) => (
          <TestimonialCard key={`${item.name}-${index}`} {...item} />
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-2" aria-label="Testimonial pagination">
        <span className="size-2.5 rounded-full bg-bbs-orange" />
        <span className="size-2.5 rounded-full bg-gray-300" />
        <span className="size-2.5 rounded-full bg-gray-300" />
      </div>
    </Section>
  )
}
