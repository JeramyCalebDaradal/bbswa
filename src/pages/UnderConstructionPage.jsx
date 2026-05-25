import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { images } from '../assets/images'

export default function UnderConstructionPage({ title }) {
  return (
    <>
      <main className="flex min-h-screen flex-col bg-[#F2F2F0]">
        <Header />

      <section className="flex-1 my-30">
        <div className="mx-auto grid h-full w-full max-w-[1200px] items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-12 lg:px-12">
          <div className="max-w-xl">
            <img src={images.maintenance} alt="" className="size-20 object-contain sm:size-24" />
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-bbs-orange">Coming Soon</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-bbs-dark sm:text-5xl">{title}</h1>
            <h2 className="mt-4 text-3xl font-bold text-bbs-dark sm:text-4xl">Under Construction</h2>
            <p className="mt-5 text-base leading-relaxed text-bbs-muted sm:text-lg">
              Improving security checks, come back later...
            </p>
          </div>
          <div className="relative flex min-h-[320px] items-center justify-center lg:justify-start">
            <img
              src={images.maintenanceImage}
              alt="Security maintenance illustration"
              className="h-auto w-full max-w-[460px] object-contain lg:max-w-[540px]"
            />
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  )
}
