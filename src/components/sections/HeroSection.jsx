import Section from '../layout/Section'
import Header from '../layout/Header'
import AppointmentForm from '../ui/AppointmentForm'
import { images } from '../../assets/images'

export default function HeroSection() {
  return (
    <Section
      id="home"
      disableContainer
      className="relative overflow-hidden bg-black text-white"
    >
      <div className="absolute inset-0">
        <img src={images.heroBg} alt="" className="h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      <div className="relative">
        <Header overlay />

        <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-5 pb-16 pt-4 sm:px-8 sm:pb-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14 lg:px-12 lg:pb-24 lg:pt-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              <span className="text-bbs-orange">Secure </span>
              your Business
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/90 sm:text-xl lg:text-2xl">
              Today&apos;s business world is threatened by a multitude of security risk
            </p>
            <button
              type="button"
              className="mt-10 inline-flex items-center gap-4 text-2xl font-semibold transition-colors hover:text-bbs-orange sm:text-3xl"
            >
              <img
                src={images.watchVideo}
                alt=""
                className="size-14 shrink-0 sm:size-16 lg:size-[72px]"
              />
              Watch Video
            </button>
          </div>

          <AppointmentForm className="mx-auto w-full max-w-md lg:max-w-none" />
        </div>
      </div>
    </Section>
  )
}
