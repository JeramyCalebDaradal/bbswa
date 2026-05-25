import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import AccentUnderline from '../components/ui/AccentUnderline'
import { images } from '../assets/images'

const partnerPrograms = [
  {
    title: 'Distributor Partner Program',
    icon: images.partnersPage.distributorProgram,
  },
  {
    title: 'Premium Partner Program',
    icon: images.partnersPage.premiumProgram,
  },
  {
    title: 'Prefered Partner Program',
    icon: images.partnersPage.preferedProgram,
  },
  {
    title: 'Referral Partner Program',
    icon: images.partnersPage.referralProgram,
  },
]

const partnerBenefits = [
  {
    title: 'We are channel-friendly and easy to do business with.',
    description:
      'Simple onboarding and deal registration process. No added capital. No revenue targets. Flexible and responsive end-user arrangements.',
    icon: images.partnersPage.channelFriendly,
  },
  {
    title: "We help you drive your company's growth and profitability.",
    description:
      'Increased market opportunities with our product and service portfolio. Access to our experts and resources. Enablement program, sales, marketing, and technical support.',
    icon: images.partnersPage.companyGrowth,
  },
  {
    title: 'We recognize and reward Partner performance.',
    description:
      'Straight-up additional Partner incentive for reaching sales milestones on top of the build-in incentives',
    icon: images.partnersPage.rewardPartner,
  },
  {
    title: 'We are committed to your success.',
    description:
      'Our Partners play a strategic role in our business. They are an integral part in the value-chain of Black Bear Securities.',
    icon: images.partnersPage.success,
  },
]

export default function PartnersPage() {
  return (
    <>
      <main>
        <section className="relative h-[500px] overflow-hidden bg-black text-white">
          <div className="absolute inset-0">
            <img
              src={images.partnersPage.heroBg}
              alt=""
              className="h-full w-full object-cover object-bottom opacity-80"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          <div className="relative flex h-full flex-col">
            <Header overlay />
            <div className="flex flex-1 items-center justify-center">
              <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-5 sm:px-8 lg:px-12">
                <h1 className="text-4xl font-bold sm:text-5xl">Partners</h1>
                <AccentUnderline className="mt-3 w-24 sm:w-28" />
                <Breadcrumbs
                  className="mt-4"
                  items={[
                    { label: 'Home', to: '/' },
                    { label: 'Partners' },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-30">
          <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-bbs-dark sm:text-4xl">PARTNERSHIP OPPORTUNITIES</h2>
            <p className="mt-5 max-w-5xl text-base leading-relaxed text-bbs-muted sm:text-lg">
              Capitalize on the ever-increasing market need for security solutions and services.Grow your
              business and secure your customers with the fastest growing premier security provider, offering
              best-in-class technologies and services. Yes, we mean business, but it does not mean we cannot
              have fun. Events and recreational activities are also part of the program.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {partnerPrograms.map((program) => (
                <article
                  key={program.title}
                  className="flex min-h-28 items-center gap-4 rounded-[20px] border border-[#e6e6e6] bg-gradient-to-b from-[#f9f9f9] to-[#e0e0e0] px-5 py-5 shadow-sm sm:px-6"
                >
                  <img src={program.icon} alt="" className="size-12 shrink-0 object-contain sm:size-14" />
                  <h3 className="text-lg font-bold text-bbs-dark sm:text-xl">{program.title}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f9f9f9] py-14 sm:py-35">
          <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <h2 className="mx-auto max-w-4xl text-center text-3xl font-bold leading-tight text-bbs-dark sm:text-4xl">
              Why choose Black Bear Securities as your security partner?
            </h2>

            <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2">
              {partnerBenefits.map((benefit) => (
                <article key={benefit.title} className="flex gap-5 py-5">
                  <img src={benefit.icon} alt="" className="mt-1 size-16 shrink-0 object-contain sm:size-20" />
                  <div>
                    <h3 className="text-xl font-bold leading-tight text-bbs-dark sm:text-[30px]">{benefit.title}</h3>
                    <p className="mt-4 text-base leading-relaxed text-bbs-muted sm:text-lg">{benefit.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
