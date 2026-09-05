import SEO from '@/components/SEO'
import PageHeader from '@/components/PageHeader'
import Capabilities from '@/components/Capabilities'
import ContactCTA from '@/components/ContactCTA'
import useReveal from '@/hooks/useReveal'
import { SITE, STATS } from '@/data/site'

const PRINCIPLES = [
  {
    title: 'Real-world usability',
    body: 'Software gets judged on the day someone has to use it under pressure, not on the day it is demoed.',
  },
  {
    title: 'Performance as a feature',
    body: 'Measured, not assumed — payload size, render path and interaction latency checked before and after a change.',
  },
  {
    title: 'Clean architecture',
    body: 'Clear boundaries between data, API and interface, so a change in one does not require rewriting the others.',
  },
  {
    title: 'Maintainable code',
    body: 'Written to be read by whoever picks it up next, which is frequently me, months later.',
  },
]

export default function About() {
  const scope = useReveal({ y: 24 })

  return (
    <>
      <SEO
        title="About"
        description={`${SITE.name} is a full-stack software engineer in ${SITE.location} building modern web applications end to end.`}
        path="/about"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: SITE.name,
            jobTitle: SITE.role,
            description: `Full-stack engineer based in ${SITE.location}, working independently with clients and on his own products.`,
          },
        }}
      />

      <PageHeader
        eyebrow="About"
        title="Wayne Kiprotich"
        lede="A full-stack software engineer in Nairobi, working independently with clients and on my own products. I move between frontend and backend without much ceremony — designing the data model one hour, tuning a transition the next."
      />

      <section ref={scope} className="shell py-16 sm:py-20" aria-label="Profile">
        <div className="shell-inner grid gap-12 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-20">
          <div data-reveal>
            <div className="overflow-hidden rounded-card border border-line bg-sand">
              <img
                src="/profile/pfp-720.jpg"
                srcSet="/profile/pfp-480.jpg 480w, /profile/pfp-720.jpg 720w, /profile/pfp-1080.jpg 1080w"
                alt={`Portrait of ${SITE.name}`}
                width="400"
                height="500"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 1024px) 70vw, 20rem"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <dl className="mt-8 border-t border-line">
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex items-baseline justify-between border-b border-line py-3">
                  <dt className="text-[13px] text-muted">{label}</dt>
                  <dd className="text-[15px] tabular-nums text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <p className="max-w-[62ch] text-[15px] leading-relaxed text-muted" data-reveal>
              I build production web applications — dashboards, platforms and full-stack
              products — for clients and for myself. That means the schema and the migration
              as often as the layout and the animation, and it means being responsible for
              the thing after it ships rather than only up to launch.
            </p>
            <p className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-muted" data-reveal>
              I care about systems that are simple to reason about and safe to change: clean
              APIs, sensible schemas, and interfaces that feel considered rather than
              assembled. I would rather write four lines of my own than add a dependency
              that does something the stack already does.
            </p>

            <ul className="mt-12 grid gap-3 sm:grid-cols-2">
              {PRINCIPLES.map(({ title, body }) => (
                <li key={title} data-reveal className="card p-6">
                  <h2 className="text-[15px] font-medium text-ink">{title}</h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Capabilities />
      <ContactCTA />
    </>
  )
}
