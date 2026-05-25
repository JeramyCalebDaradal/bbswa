import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import FeatureCard from '../components/ui/FeatureCard'
import SectionHeading from '../components/ui/SectionHeading'
import AccentUnderline from '../components/ui/AccentUnderline'
import { aboutFeatures, clientIndustries } from '../data/homeContent'

const companyOverview = `Headquartered in Manila, Philippines, we have built our CORE competencies empowering our clients with advance technologies and practitioners that specializes on comprehensive background investigations, VIP security and counter measures, threat intelligence, physical security assessment, information security risk assessments, compliance implementations, authoring data privacy practices, digital forensics and incident response investigations, N/SOC and CSIRT design and build, VAPT on network, mobile and web applications, building an ERT for disaster recovery, command center implementations, IT service management and business continuity planning to ensure your peace of mind.`

const companyIntro = `From digital forensics to disaster recovery planning, we empower clients with comprehensive solutions for peace of mind in a dynamic world.`

const valuesOverview = `In our line of business, our clients come first. Every day, our employees come to work and focuses only on our unwavering commitment to help them succeed. We follow the highest military standards in security protocols to keep our client and their information secure. We leverage our industry experience to provide them the information they require about the adversary using various attribution models. We build case profiles and comprehensive research on the persons of interests, their affiliated organizations and matrix analysis on the related ICT infrastructures.

Based on our extensive experience in the frontlines, our research and development teams have created proactive defense platforms for our tactical operations and coordination center that specializes on resolving national security issues. Our case handlers, intelligence officers and linguists are continuously monitoring chatter in the surface, deep and dark web to protect the reputation of our clients.`

const aboutFeatureOrder = [
  aboutFeatures[0],
  aboutFeatures[2],
  aboutFeatures[1],
  aboutFeatures[3],
]

export default function AboutPage() {
  return (
    <>
      <main>
        <section className="relative h-[500px] overflow-hidden bg-black text-white">
          <div className="absolute inset-0">
            <img
              src="assets/about.jpg"
              alt=""
              className="h-full w-full object-cover object-[0%_20%] opacity-55"
            />
            <div className="absolute inset-0 bg-black/35" />
          </div>

          <div className="relative flex h-full flex-col">
            <Header overlay />
            <div className="flex flex-1 items-center justify-center">
              <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-5 sm:px-8 lg:px-12">
                <h1 className="text-4xl font-bold sm:text-5xl">About</h1>
                <AccentUnderline className="mt-3 w-24 sm:w-28" />
                <Breadcrumbs
                  className="mt-4"
                  items={[
                    { label: 'Home', to: '/' },
                    { label: 'About' },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-bbs-dark sm:text-4xl">THE COMPANY</h2>
            <p className="mt-6 max-w-6xl text-base leading-relaxed text-bbs-muted sm:text-lg">{companyOverview}</p>
            <p className="mt-8 max-w-4xl text-base leading-relaxed text-bbs-muted sm:text-lg">{companyIntro}</p>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {aboutFeatureOrder.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-bbs-surface py-[66px] sm:py-[90px]">
          <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <SectionHeading title="Our Clients" className="mb-6" />
            <p className="mb-10 max-w-5xl text-base leading-relaxed text-bbs-muted sm:text-lg">
              Our clients are the majority of government agencies, conglomerates or private businesses and
              renowned personalities. Our platforms and multidisciplinary services spans across all industry
              verticals and geographies. We value our client&apos;s privacy and NDA, hence here are some brief
              descriptions of our previous engagements:
            </p>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
              {clientIndustries.map((client) => (
                <div key={client.label} className="flex flex-col items-center gap-4 text-center">
                  <img src={client.icon} alt="" className="size-14 object-contain sm:size-16 md:size-[72px]" />
                  <p className="text-sm font-semibold text-bbs-muted sm:text-base">{client.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-30">
          <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-bbs-dark sm:text-4xl">OUR VALUES</h2>
            <p className="mt-6 max-w-6xl whitespace-pre-line text-base leading-relaxed text-bbs-muted sm:text-lg">
              {valuesOverview}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
