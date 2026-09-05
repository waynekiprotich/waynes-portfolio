import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '@/lib/motion'

/**
 * Full-viewport counter that climbs to 100, then lifts away as a shutter.
 * The count tracks real readiness: once the document reports `complete` the
 * timeline speeds up, so a warm cache never sits through the full sequence.
 */
export default function Preloader({ onDone }) {
  const root = useRef(null)
  const content = useRef(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) {
      onDone?.()
      return
    }

    const ctx = gsap.context(() => {
      const progress = { value: 0 }
      const tl = gsap.timeline({ onComplete: () => onDone?.() })

      tl.to(progress, {
        value: 100,
        duration: 1.6,
        ease: 'power2.inOut',
        onUpdate: () => setCount(Math.round(progress.value)),
      })
        .to(content.current, { opacity: 0, duration: 0.28, ease: 'power2.out' })
        .to(root.current, { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, '-=0.04')
        .set(root.current, { display: 'none' })

      const accelerate = () => tl.timeScale(2.4)
      if (document.readyState === 'complete') accelerate()
      else window.addEventListener('load', accelerate, { once: true })
      return () => window.removeEventListener('load', accelerate)
    }, root)

    // The preloader covers the whole site, so it must never be able to get
    // stuck: if the timeline has not finished on its own by now (a throttled
    // ticker, a first load in a background tab), hand control back anyway.
    const failsafe = setTimeout(() => onDone?.(), 5000)

    return () => {
      clearTimeout(failsafe)
      ctx.revert()
    }
  }, [onDone])

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bone"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div ref={content} className="flex flex-col items-center gap-7">
        <span className="text-[clamp(3.5rem,13vw,9rem)] font-medium tracking-tighter tabular-nums text-ink">
          {count}
        </span>
        <span
          aria-hidden="true"
          className="h-5 w-5 animate-spin rounded-full border border-line border-t-ink"
        />
      </div>
    </div>
  )
}
