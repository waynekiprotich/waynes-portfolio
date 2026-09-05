import { useEffect, useRef } from 'react'

const REVEALED = 'is-revealed'

/**
 * Reveals every `[data-reveal]` descendant of the returned ref as it enters
 * the viewport, staggering siblings by their order in the DOM.
 *
 * Driven by IntersectionObserver rather than ScrollTrigger: the decision to
 * show content must not depend on the smooth-scroll ticker, because anything
 * that stalls the ticker would otherwise leave the page blank.
 */
export default function useReveal(options = {}, deps = []) {
  const scope = useRef(null)
  const { stagger = 0.08, rootMargin = '0px 0px -12% 0px' } = options

  useEffect(() => {
    const root = scope.current
    if (!root) return

    const els = Array.from(root.querySelectorAll('[data-reveal]'))
    if (!els.length) return

    // No observer support, or reduced motion: show everything immediately.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add(REVEALED))
      return
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        // Stagger by position within the batch that crossed together.
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry, i) => {
            entry.target.style.transitionDelay = `${i * stagger}s`
            entry.target.classList.add(REVEALED)
            obs.unobserve(entry.target)
          })
      },
      { rootMargin, threshold: 0.01 }
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return scope
}
