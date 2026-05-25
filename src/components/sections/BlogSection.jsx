import Section from '../layout/Section'
import SectionHeading from '../ui/SectionHeading'
import BlogCard from '../ui/BlogCard'
import { blogPosts } from '../../data/homeContent'

export default function BlogSection() {
  return (
    <Section className="bg-[#F6FAFF] py-18 sm:py-30">
      <SectionHeading
        eyebrow="Popular News"
        title="Latest From our blog"
        highlight="From"
        align="center"
        className="mb-10 mx-auto"
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {blogPosts.map((post, index) => (
          <BlogCard key={`${post.date}-${index}`} {...post} />
        ))}
      </div>
    </Section>
  )
}
