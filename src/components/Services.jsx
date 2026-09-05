import { Link } from 'react-router-dom'
import SectionHeading from './SectionHeading'
import useReveal from '@/hooks/useReveal'
import { SERVICES } from '@/data/site'

/** Editorial list. Each row lifts on hover, focus or tap; nothing is hover-only. */
export default function Services({ withHeading = true, limit }) {
  const scope = useReveal({ y: 24 })
  const items = limit ? SERVICES.slice(0, limit) : SERVICES

  return (
    <section ref={scope} aria-labelledby="services" className="shell py-20 sm:py-28">
      <div className="shell-inner">
        {withHeading && (
          <SectionHeading
            centered
            id="services"
            eyebrow="Services"
            title="What I take on"
            aside={<Link to="/services" className="btn btn-ghost">Full detail</Link>}
          />
        )}

        <ul className="mt-14 space-y-3">
          {items.map(({ number, title, description, tags }) => (
            <li key={number} data-reveal>
              <div
                className="card group grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 p-6 transition-colors
                           duration-200 ease-editorial hover:border-lineStrong
                           sm:grid-cols-[auto_minmax(0,24ch)_1fr] sm:gap-x-10 sm:p-8"
              >
                <span className="font-mono text-[12px] text-faint sm:pt-2">{number}</span>

                <h3
                  className="text-[clamp(1.2rem,2.2vw,1.9rem)] font-medium tracking-tight
                             transition-transform duration-200 ease-editorial
                             group-hover:translate-x-1.5 motion-reduce:transform-none"
                >
                  {title}
                </h3>

                <div className="col-start-2 sm:col-start-3">
                  <p className="max-w-[54ch] text-[14px] leading-relaxed text-muted">
                    {description}
                  </p>
                  {tags?.length > 0 && (
                    <p className="mt-4 flex flex-wrap gap-2">
                      {tags.map((t) => (
                        <span key={t} className="chip cursor-default">{t}</span>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
