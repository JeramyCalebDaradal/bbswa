import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Section from './Section'
import { images } from '../../assets/images'
import { footerServices } from '../../data/homeContent'

function ContactLine({ icon, children, href }) {
  const content = (
    <span className="inline-flex items-start gap-3">
      <img src={icon} alt="" className="mt-0.5 size-5 shrink-0 object-contain" />
      <span>{children}</span>
    </span>
  )

  if (href) {
    return (
      <a href={href} className="block text-white/90 transition-colors hover:text-bbs-orange">
        {content}
      </a>
    )
  }

  return <div className="text-white/90">{content}</div>
}

export default function Footer() {
  return (
    <footer id="contact" className="bg-black text-white">
      <Section className="py-12 sm:py-16">
        <div className="mb-10 sm:mb-12">
          <img src={images.logo} alt="Black Bear Securities" className="h-16 w-auto sm:h-20" />
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-xl font-bold">Contact</h3>
            <address className="space-y-3 not-italic text-sm leading-relaxed sm:text-base">
              <ContactLine icon={images.footer.location}>
                <>
                  8 Rockwell Center
                  <br />
                  8 Rockwell Drive, Makati City
                  <br />
                  Philippines
                </>
              </ContactLine>
              <ContactLine icon={images.footer.email} href="mailto:concierge@blackbearsecurities.com">
                concierge@blackbearsecurities.com
              </ContactLine>
              <ContactLine icon={images.footer.phone} href="tel:+63286837594">
                63286837594
              </ContactLine>
            </address>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold">Top Services</h3>
            <ul className="space-y-2 text-sm text-white/90 sm:text-base">
              {footerServices.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold">News Letter</h3>
            <div className="flex max-w-md overflow-hidden">
              <TextField
                placeholder="Email"
                variant="outlined"
                slotProps={{
                  input: {
                    className: '!rounded-none !bg-white !px-3 !py-2 !text-bbs-dark',
                  },
                }}
                className="flex-1"
                sx={{ '& fieldset': { border: 'none' } }}
              />
              <Button
                variant="contained"
                color="primary"
                className="!rounded-none !px-6 !shadow-none"
              >
                Subscribe
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <p className="text-base">Follow Us</p>
              <div className="flex items-center gap-3 sm:gap-4">
                <a href="#" aria-label="Facebook" className="transition-opacity hover:opacity-80">
                  <img
                    src={images.footer.facebook}
                    alt=""
                    className="size-7 object-contain sm:size-8"
                  />
                </a>
                <a href="#" aria-label="Instagram" className="transition-opacity hover:opacity-80">
                  <img
                    src={images.footer.instagram}
                    alt=""
                    className="size-7 object-contain sm:size-8"
                  />
                </a>
                <a href="#" aria-label="LinkedIn" className="transition-opacity hover:opacity-80">
                  <img
                    src={images.footer.linkedin}
                    alt=""
                    className="size-7 object-contain sm:size-8"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/60">
          © {new Date().getFullYear()} Black Bear Securities. All rights reserved.
        </p>
      </Section>
    </footer>
  )
}
