import SEO from '@/components/SEO'
import PageHeader from '@/components/PageHeader'
import useReveal from '@/hooks/useReveal'
import { SITE } from '@/data/site'

const CHANNELS = [
  { label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
  { label: 'Phone', value: SITE.phoneDisplay, href: `tel:${SITE.phone}` },
  { label: 'GitHub', value: 'github.com/waynekiprotich', href: SITE.github, external: true },
  { label: 'LinkedIn', value: 'Wayne Kiprotich', href: SITE.linkedin, external: true },
  { label: 'Instagram', value: '@mr._.w.a.y.n.e', href: SITE.instagram, external: true },
]

export default function Contact() {
  const scope = useReveal({ y: 24 })

  return (
    <>
      <SEO
        title="Contact"
        description={`Get in touch with ${SITE.name}, ${SITE.role} based in ${SITE.location}.`}
        path="/contact"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          mainEntity: {
            '@type': 'Person',
            name: SITE.name,
            jobTitle: SITE.role,
            email: SITE.email,
            telephone: SITE.phone,
            url: `${SITE.url}/contact`,
          },
        }}
      />

      <PageHeader
        eyebrow="Contact"
        title="Have a problem worth building?"
        lede="Tell me what the software needs to do and who has to use it. If it is a good fit, I will come back with scope, a build order and a realistic timeline."
      />

      <section ref={scope} className="shell py-16 sm:py-20" aria-label="Contact details">
        <div className="shell-inner">
          <ul className="border-t border-line">
            {CHANNELS.map(({ label, value, href, external }) => (
              <li key={label} data-reveal className="group border-b border-line">
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="grid grid-cols-1 gap-1 py-6 sm:grid-cols-[minmax(0,12rem)_1fr] sm:items-baseline sm:gap-10"
                >
                  <span className="eyebrow">{label}</span>
                  <span className="text-[clamp(1.05rem,2vw,1.5rem)] tracking-tight
                                   transition-transform duration-200 ease-editorial
                                   group-hover:translate-x-2 motion-reduce:transform-none">
                    {value}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-[14px] text-muted">
            Based in {SITE.location}. Working with clients remotely and locally.
          </p>
        </div>
      </section>
    </>
  )
}
