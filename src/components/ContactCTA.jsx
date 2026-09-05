import { Link } from 'react-router-dom'
import useReveal from '@/hooks/useReveal'
import { SITE } from '@/data/site'

export default function ContactCTA() {
  const scope = useReveal({ y: 30 })

  return (
    <section ref={scope} aria-labelledby="contact-cta" className="shell py-8 sm:py-12">
      <div className="shell-inner">
        <div className="card px-6 py-16 text-center sm:px-12 sm:py-24" data-reveal>
          <h2 id="contact-cta" className="mx-auto max-w-[16ch] text-statement">
            Have a problem worth building?
          </h2>

          <p className="mx-auto mt-8 max-w-[52ch] text-lede text-muted">
            Tell me what the software needs to do and who has to use it. If it is a good fit,
            I will come back with scope, a build order and a realistic timeline.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <a href={`mailto:${SITE.email}`} className="btn btn-solid">{SITE.email}</a>
            <Link to="/estimator" className="btn btn-ghost">Scope a project</Link>
            <Link to="/contact" className="btn btn-ghost">All contact details</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
