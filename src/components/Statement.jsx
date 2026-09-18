import { useEffect, useRef } from 'react'
import useReveal from '@/hooks/useReveal'
import { gsap, prefersReducedMotion } from '@/lib/motion'

const TEXT =
  'I build software for real use — chosen for the problem, measured after it ships, and simple enough to change later.'

const TAGS = [
  'Real-world usability',
  'Performance',
  'Clean architecture',
  'Maintainable code',
  'Practical choices',
  'Responsive interfaces',
]

/**
 * Large centred statement. Words light up in reading order as the section
 * scrolls through, scrubbed to scroll position so the reader sets the pace.
 */
export default function Statement() {
  const scope = useReveal({ y: 26, stagger: 0.06 })
  const heading = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const words = heading.current?.querySelectorAll('[data-w]')
    if (!words?.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.08,
          scrollTrigger: { trigger: heading.current, start: 'top 82%', end: 'bottom 45%', scrub: 0.4 },
        }
      )
    }, heading)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={scope} aria-labelledby="statement" className="shell py-24 sm:py-40">
      <div className="shell-inner">
        <h2
          id="statement"
          ref={heading}
          className="mx-auto max-w-[22ch] text-center text-statement sm:max-w-[24ch]"
        >
          {TEXT.split(' ').map((w, i) => (
            <span key={i} data-w className="inline-block whitespace-pre">
              {w}{' '}
            </span>
          ))}
        </h2>

        <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-2" data-reveal>
          {TAGS.map((tag) => (
            <li key={tag} className="chip cursor-default">{tag}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
