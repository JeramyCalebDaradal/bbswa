import Footer from '../components/layout/Footer'
import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'
import ClientsSection from '../components/sections/ClientsSection'
import AlliancesSection from '../components/sections/AlliancesSection'
import ServicesSection from '../components/sections/ServicesSection'
import WhyChooseUsSection from '../components/sections/WhyChooseUsSection'
import PartnershipSection from '../components/sections/PartnershipSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import BlogSection from '../components/sections/BlogSection'

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <AboutSection />
        <ClientsSection />
        <AlliancesSection />
        <ServicesSection />
        <WhyChooseUsSection />
        <PartnershipSection />
        <TestimonialsSection />
        <BlogSection />
      </main>
      <Footer />
    </>
  )
}
