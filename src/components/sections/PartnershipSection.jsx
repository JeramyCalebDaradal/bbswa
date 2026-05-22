import Section from '../layout/Section'
import AccentButton from '../ui/AccentButton'
import { images } from '../../assets/images'

export default function PartnershipSection() {
  return (
    <Section disableContainer className="bg-black text-white">
      <div className="grid lg:grid-cols-2">
        <div className="relative flex min-h-72 items-center justify-center overflow-hidden lg:min-h-[28rem]">
          <img
            src={images.partnership}
            alt="Business partnership handshake"
            className="h-full w-full object-cover object-center grayscale"
          />
        </div>

        <div className="flex flex-col justify-center px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
          <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            <span className="text-bbs-orange">PARTNERSHIP</span> OPPORTUNITIES
          </h2>
          <p className="mt-6 text-base leading-relaxed text-white/90 sm:text-lg">
            Capitalize on the ever-increasing market need for security solutions and services. Grow
            your business and secure your customers with the fastest growing premier security provider,
            offering best-in-class technologies and services.
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
            Yes, we mean business, but it does not mean we cannot have fun. Events and recreational
            activities are also part of the program.
          </p>
          <AccentButton className="!mt-8 !w-fit">Learn More</AccentButton>
        </div>
      </div>
    </Section>
  )
}
