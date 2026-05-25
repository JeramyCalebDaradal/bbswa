import { Navigate, useParams } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import AccentUnderline from '../components/ui/AccentUnderline'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { images } from '../assets/images'
import { serviceBySlug } from '../data/servicesContent'
import AccentButton from '../components/ui/AccentButton'
import InquireButton from '../components/ui/InquireButton'

function renderParsedText(text = '') {
  const lines = text.split('\n')

  return lines.flatMap((line, lineIndex) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g)
    const renderedParts = parts.map((part, partIndex) => {
      const isBold = part.startsWith('**') && part.endsWith('**')
      if (isBold) {
        return <strong key={`line-${lineIndex}-part-${partIndex}`}>{part.slice(2, -2)}</strong>
      }
      return <span key={`line-${lineIndex}-part-${partIndex}`}>{part}</span>
    })

    if (lineIndex < lines.length - 1) {
      renderedParts.push(<br key={`line-break-${lineIndex}`} />)
    }

    return renderedParts
  })
}

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const service = serviceBySlug[slug ?? '']

  if (!service) {
    return <Navigate to="/services" replace />
  }

  return (
    <>
      <main>
        <section className="relative overflow-hidden bg-black text-white h-[500px]">
          <div className="absolute inset-0">
            <img src={service.heroImage || images.serviceDetailHeroDefault} alt="" className="h-full w-full object-cover opacity-55" />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="relative h-full flex flex-col">
            <Header overlay />
            <div className="flex-1 flex items-center justify-center">
              <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-5 sm:px-8 lg:px-12">
                <h1 className="text-4xl font-bold sm:text-5xl">Services</h1>
                <AccentUnderline className="mt-3" />
                <Breadcrumbs
                  className="mt-4"
                  items={[
                    { label: 'Home', to: '/' },
                    { label: 'Services', to: '/services' },
                    { label: service.code },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <div className="bg-white p-6 sm:p-8 lg:p-10">
              <div className="mb-5 flex items-center gap-4">
                {/* <img src={service.icon} alt="" className="size-16 shrink-0 object-contain sm:size-20" /> */}
                <div>
                  {/* <p className="text-sm font-semibold uppercase tracking-wide text-bbs-orange sm:text-base">
                    {service.code}
                  </p> */}
                  <h2 className="text-2xl font-bold text-bbs-dark sm:text-3xl">{service.title}</h2>
                </div>
              </div>

              <p className="text-base leading-relaxed text-bbs-muted sm:text-lg">{renderParsedText(service.summary)}</p>
              <p className="mt-4 text-base leading-relaxed text-bbs-muted sm:text-lg">{renderParsedText(service.overview)}</p>
            </div>
          </div>
        </section>

        <section className="bg-[#f2f2f4] py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-5xl">
              <div className="grid items-stretch gap-6 md:grid-cols-3">
                {service.cards.map((card) => (
                  <article
                    key={card.title}
                    className="relative h-full rounded-3xl border border-gray-300 bg-white px-8 pb-7 pt-16 shadow-md"
                  >
                    <div className="absolute left-1/2 top-0 flex size-[120px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-bbs-orange bg-black">
                      <img src={card.icon} alt="" className="size-18 object-contain" />
                    </div>
                    <h3 className="mt-5 mb-2 text-center text-xl font-bold leading-tight text-bbs-dark sm:text-xl">{card.title}</h3>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-bbs-muted sm:text-base">
                      {card.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <AccentButton className="w-full !text-base sm:w-auto !text-lg">Download White Paper</AccentButton>
                <InquireButton className="w-full !text-base sm:w-auto !text-lg">INQUIRE NOW</InquireButton>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
