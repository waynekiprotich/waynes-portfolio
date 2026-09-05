import { useEffect, useRef, useState } from 'react'
import SectionHeading from './SectionHeading'
import useReveal from '@/hooks/useReveal'
import { gsap, prefersReducedMotion } from '@/lib/motion'
import { PROCESS } from '@/data/site'

/**
 * Seven steps. A scrubbed rail tracks the section through the viewport; hover
 * or focus promotes an individual step.
 */
export default function Process() {
  const scope = useReveal({ y: 24 })
  const rail = useRef(null)
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (prefersReducedMotion() || !rail.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rail.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: rail.current.parentNode,
            start: 'top 72%',
            end: 'bottom 72%',
            scrub: 0.4,
          },
        }
      )
    }, rail)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={scope} aria-labelledby="process" className="shell py-20 sm:py-28">
      <div className="shell-inner">
        <SectionHeading
          centered
          id="process"
          eyebrow="Process"
          title="Seven steps, in the order they actually happen"
        />

        <div className="relative mt-14 pl-7 sm:pl-12">
          <span className="absolute left-0 top-0 h-full w-px bg-line" aria-hidden="true" />
          <span
            ref={rail}
            className="absolute left-0 top-0 h-full w-px origin-top bg-ink"
            aria-hidden="true"
          />

          <ol className="space-y-3">
            {PROCESS.map(({ number, title, description }, i) => (
              <li
                key={number}
                data-reveal
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                tabIndex={0}
                className={`card grid grid-cols-[auto_1fr] gap-x-5 p-5 transition-colors duration-200
                            sm:grid-cols-[auto_minmax(0,18ch)_1fr] sm:gap-x-10 sm:p-6 ${
                              active === i ? 'border-lineStrong' : ''
                            }`}
              >
                <span className="font-mono text-[12px] text-faint sm:pt-1.5">{number}</span>
                <h3 className="text-[clamp(1.05rem,1.8vw,1.5rem)] font-medium tracking-tight">
                  {title}
                </h3>
                <p className="col-start-2 mt-2 max-w-[52ch] text-[14px] leading-relaxed text-muted sm:col-start-3 sm:mt-1">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
