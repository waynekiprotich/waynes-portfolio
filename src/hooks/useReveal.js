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

    // Don't re-reveal elements that are already revealed (handles StrictMode cleanup).
    const toObserve = els.filter((el) => !el.classList.contains(REVEALED))
    if (!toObserve.length) return

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

    toObserve.forEach((el) => observer.observe(el))

    // IntersectionObserver only fires on a genuine intersecting/not-intersecting
    // transition sampled between rendering opportunities. A background tab
    // resuming, or a large scroll jump (Lenis + ScrollTrigger.refresh landing
    // on a new position in one step) can move an element clean across the
    // viewport between two samples, so the transition is never observed and
    // the element is stuck invisible with nothing left watching it. A short
    // rAF sweep right after mount catches that case by re-checking geometry
    // directly, then stops itself as soon as nothing is left to catch up on.
    let pending = new Set(toObserve)
    const sweep = () => {
      pending.forEach((el) => {
        if (el.classList.contains(REVEALED)) {
          pending.delete(el)
          return
        }
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight || document.documentElement.clientHeight
        if (rect.top < vh && rect.bottom > 0) {
          el.classList.add(REVEALED)
          observer.unobserve(el)
          pending.delete(el)
        }
      })
    }

    let raf = null
    let frames = 0
    const poll = () => {
      sweep()
      frames += 1
      // ~2s at 60fps covers the preloader/route-transition window; after
      // that, visibility/focus/pageshow below still catch later jumps.
      if (pending.size && frames < 120) raf = requestAnimationFrame(poll)
    }
    raf = requestAnimationFrame(poll)

    const onVisible = () => document.visibilityState === 'visible' && sweep()
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('pageshow', sweep)
    window.addEventListener('focus', sweep)

    return () => {
      observer.disconnect()
      if (raf) cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('pageshow', sweep)
      window.removeEventListener('focus', sweep)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return scope
}
