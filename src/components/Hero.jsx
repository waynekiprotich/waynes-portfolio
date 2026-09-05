import { Fragment, useEffect, useRef } from 'react'
import { Link } from '@/lib/router'
import { gsap, prefersReducedMotion } from '@/lib/motion'
import { SITE } from '@/data/site'

const NAME = ['Wayne', 'Kiprotich']

/**
 * Type-only hero: the name is the image. Atmosphere comes from a drifting
 * light wash plus grain, so nothing has to be sourced or faked.
 *
 * The intro is CSS (see styles/index.css); GSAP handles only the parallax,
 * which degrades to a static wash if it never runs.
 */
export default function Hero() {
  const root = useRef(null)
  const wash = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.to(wash.current, {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  // Pointer drift written straight to a CSS variable, rAF-throttled, so it
  // never causes a React render or a layout read.
  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return
    const el = wash.current
    if (!el) return

    let frame = 0
    const onMove = (e) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        el.style.setProperty('--dx', `${(e.clientX / window.innerWidth - 0.5) * 46}px`)
        el.style.setProperty('--dy', `${(e.clientY / window.innerHeight - 0.5) * 46}px`)
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      ref={root}
      aria-label="Introduction"
      // Shorter and less top-padded on a phone: a full 100svh with a fixed
      // 128px top offset means over a third of the very first screen is
      // empty before any content appears — fine on desktop's slower,
      // mouse-driven scroll, but it makes a phone's first flick feel like
      // nothing loaded. Full-height drama returns from `sm:` up.
      className="relative flex min-h-[78svh] flex-col justify-end overflow-hidden shell
                 pb-20 pt-20 sm:min-h-[100svh] sm:pb-28 sm:pt-32"
    >
      <div
        ref={wash}
        aria-hidden="true"
        className="pointer-events-none absolute -top-[22%] left-1/2 h-[85vmax] w-[85vmax]
                   -translate-x-1/2 rounded-full opacity-80 blur-[120px]"
        style={{
          background:
            'radial-gradient(closest-side, rgb(var(--c-sky) / 0.28), rgb(var(--c-sand) / 0.55) 48%, transparent 72%)',
          transform: 'translate3d(calc(-50% + var(--dx, 0px)), var(--dy, 0px), 0)',
          transition: 'transform 700ms cubic-bezier(0.22,1,0.36,1)',
        }}
      />

      <div className="shell-inner relative">
        <p className="eyebrow" data-intro-fade style={{ animationDelay: '0.18s' }}>
          {SITE.location} — Available for work
        </p>

        <h1 className="mt-6 text-display">
          {/* A real space between words, not padding: padding looks the same
              but leaves the accessible name reading as one run-on word. */}
          {NAME.map((word, i) => (
            <Fragment key={word}>
              <span className="inline-block overflow-hidden align-bottom">
                <span
                  data-word
                  className="inline-block"
                  style={{ animationDelay: `${0.04 + i * 0.07}s` }}
                >
                  {word}
                </span>
              </span>
              {i < NAME.length - 1 && ' '}
            </Fragment>
          ))}
        </h1>

        <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-[minmax(0,26ch)_minmax(0,40ch)_1fr] md:gap-12">
          <p className="text-lede leading-snug text-ink" data-intro-fade style={{ animationDelay: '0.24s' }}>
            Full-Stack Software Engineer building software that holds up in use.
          </p>

          <p className="text-[14px] leading-relaxed text-muted" data-intro-fade style={{ animationDelay: '0.30s' }}>
            I design and ship modern web applications end to end — the data model, the API and
            the interface people actually touch.
          </p>

          <div
            className="flex flex-wrap items-start gap-2 md:justify-end"
            data-intro-fade
            style={{ animationDelay: '0.36s' }}
          >
            <Link to="/work" className="btn btn-solid">Selected work</Link>
            <Link to="/contact" className="btn btn-ghost">Start a project</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
