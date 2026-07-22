import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ServiceCard from '../components/ui/ServiceCard'
import AccentUnderline from '../components/ui/AccentUnderline'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { images } from '../assets/images'
import { serviceTopics } from '../data/servicesContent'

export default function ServicesPage() {
  return (
    <>
      <main>
        <section className="relative overflow-hidden bg-black text-white h-[500px]">
          <div className="absolute inset-0">
            <img src={images.servicesHeroBg} alt="" className="h-full w-full object-cover" loading="eager" fetchpriority="high" width="1200" height="500" />
            <div className="absolute inset-0 bg-black/45" />
          </div>

          <div className="relative flex h-full flex-col">
            <Header overlay />
            <div className="flex flex-1 items-center justify-center">
              <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-5 sm:px-8 lg:px-12">
                <h1 className="text-4xl font-bold sm:text-5xl">Services</h1>
                <AccentUnderline className="mt-3" />
                <Breadcrumbs
                  className="mt-4"
                  items={[
                    { label: 'Home', to: '/' },
                    { label: 'Services' },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-black py-14 sm:py-20">
          <div className="absolute inset-0 opacity-40">
            <img src={images.servicesGlobeBg} alt="" className="h-full w-full object-cover" loading="lazy" width="1200" height="600" />
          </div>
          <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {serviceTopics.map((service) => (
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
        </section>
      </main>
      <Footer />
    </>
  )
}
