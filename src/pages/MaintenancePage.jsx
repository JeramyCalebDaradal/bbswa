import { useState } from 'react'
import { Clock3, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import bearBackground from '../assets/maintenance/maintenance-bear.jpg'
import bbsLogo from '../assets/maintenance/bbs-logo.png'

const contactItems = [
  { label: 'Status', value: 'In Progress', detail: 'Upgrades underway', icon: Clock3 },
  { label: 'Location', value: 'Makati City', detail: '8 Rockwell Center, Philippines', icon: MapPin },
  {
    label: 'Email Us',
    value: 'concierge@blackbearsecurities.com',
    detail: 'We respond within 24 hours',
    icon: Mail,
    href: 'mailto:concierge@blackbearsecurities.com',
  },
  {
    label: 'Call Us',
    value: '+63 2 8883 7102',
    detail: 'Available during business hours',
    icon: Phone,
    href: 'tel:+63288837102',
  },
]

const socialItems = [
  { name: 'Facebook', href: 'https://facebook.com/blackbearsecurities', icon: Facebook, color: '#1877f2' },
  { name: 'Instagram', href: 'https://instagram.com/blackbearsecurities', icon: Instagram, color: '#e1306c' },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/blackbearsecurities', icon: Linkedin, color: '#0a66c2' },
]

export default function MaintenancePage() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const mask = `radial-gradient(circle at ${cursor.x}px ${cursor.y}px, #000 80px, transparent 150px)`

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#0a0c0a] text-white"
      onPointerEnter={() => setIsHovering(true)}
      onPointerLeave={() => setIsHovering(false)}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        setCursor({ x: event.clientX - rect.left, y: event.clientY - rect.top })
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-[0.18]"
        style={{ backgroundImage: `url(${bearBackground})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(245, 165, 0, 0.12) 1.2px, transparent 1.4px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-150"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(245, 165, 0, 0.3) 2px, transparent 2.2px)',
          backgroundSize: '22px 22px',
          opacity: isHovering ? 1 : 0,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between border-b border-[#1e221e] px-4 py-4 sm:px-8 sm:py-6 lg:px-14">
          <img src={bbsLogo} alt="Black Bear Securities" className="h-8 w-auto object-contain sm:h-10" width="512" height="148" />
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f5a500] opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#f5a500]" />
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-[#888] sm:block">Scheduled Maintenance</span>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-16">
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <div className="h-px w-7 bg-[#f5a500] sm:w-10" />
            <span className="font-semibold uppercase tracking-[0.24em] text-[#f5a500] sm:tracking-[0.3em]">Under Maintenance</span>
            <div className="h-px w-7 bg-[#f5a500] sm:w-10" />
          </div>

          <h1 className="max-w-4xl text-4xl font-bold uppercase leading-[0.95] text-white sm:text-6xl lg:text-8xl">
            We're <span className="text-[#f5a500]">Securing</span>
            <br />
            Our Platform.
          </h1>
          <p className="mt-6 max-w-xl text-sm font-light leading-relaxed text-[#9a9a9a] sm:mt-8 sm:text-base">
            Our website is temporarily offline for scheduled upgrades and security enhancements. We'll be back online shortly, more secure than ever.
          </p>

          <div className="my-8 flex items-center gap-3 sm:my-10" aria-hidden="true">
            <div className="h-px w-8 bg-[#2a2e2a]" />
            <div className="h-1 w-1 rounded-full bg-[#f5a500] opacity-60" />
            <div className="h-px w-8 bg-[#2a2e2a]" />
          </div>

          <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Maintenance information">
            {contactItems.map((item) => (
              <ContactItem key={item.label} {...item} />
            ))}
          </section>

          <section className="mt-8 w-full max-w-5xl border-t border-[#2a2e2a] pt-8 sm:mt-12 sm:pt-10" aria-labelledby="maintenance-social-title">
            <p className="text-sm text-[#888]">You can message and follow us on</p>
            <h2 id="maintenance-social-title" className="mt-1 text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">Our Social Media</h2>
            <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
              {socialItems.map(({ name, href, icon: Icon, color }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 border-b border-[#2a2e2a] px-4 py-4 text-left transition-colors hover:border-[#f5a500]/60 sm:flex-col sm:border-b-0 sm:px-6 sm:text-center"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border" style={{ color, borderColor: `${color}55`, backgroundColor: `${color}18` }}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block font-bold uppercase tracking-wide text-white">{name}</span>
                    <span className="mt-1 block text-xs text-[#666]">Message &amp; follow us</span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        </main>

        <footer className="flex flex-col items-center justify-between gap-2 border-t border-[#1e221e] px-4 py-5 text-center sm:px-8 md:flex-row md:text-left lg:px-14">
          <p className="text-xs tracking-wide text-[#666]">© {new Date().getFullYear()} Black Bear Securities. All rights reserved.</p>
          <p className="text-xs uppercase tracking-[0.16em] text-[#666]">Security upgrades in progress</p>
        </footer>
      </div>
    </div>
  )
}

function ContactItem({ label, value, detail, icon: Icon, href }) {
  const content = (
    <div className="h-full border-l border-[#2a2e2a] px-4 py-4 text-left transition-colors hover:border-[#f5a500] sm:px-5">
      <Icon className="mb-3 h-5 w-5 text-[#f5a500]" />
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#666]">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs leading-relaxed text-[#777]">{detail}</p>
    </div>
  )

  return href ? <a href={href} className="block h-full">{content}</a> : content
}
