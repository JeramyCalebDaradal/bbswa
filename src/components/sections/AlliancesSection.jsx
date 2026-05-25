import Section from '../layout/Section'
import AccentUnderline from '../ui/AccentUnderline'
import { images } from '../../assets/images'

function LogoRow({ title, logos }) {
  return (
    <div>
      <div className="mb-8 flex flex-col items-center gap-3">
        <h3 className="text-center text-xl font-bold text-bbs-dark sm:text-2xl">{title}</h3>
        <AccentUnderline />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-10 sm:gap-y-8">
        {logos.map((logo, index) => (
          <div key={`${title}-${index}`} className="flex w-28 items-center justify-center sm:w-32">
            <img src={logo} alt="" className="max-h-14 w-full object-contain sm:max-h-30" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AlliancesSection() {
  const midpoint = Math.ceil(images.alliances.length / 2)

  return (
    <Section className="bg-white py-18 sm:py-30">
      <LogoRow title="Our Alliances" logos={images.alliances.slice(0, midpoint)} />
      <div className="my-16 sm:my-20" aria-hidden="true" />
      <LogoRow title="Our Partners" logos={images.alliances.slice(midpoint)} />
    </Section>
  )
}
