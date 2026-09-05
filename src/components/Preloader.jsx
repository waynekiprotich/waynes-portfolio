import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/lib/motion'

/**
 * A shutter that lifts off the page, once per session.
 *
 * Deliberately not a progress counter: the old one climbed to 100 over 1.6s
 * of invented progress, which is time every first-time visitor paid before
 * seeing anything. The page underneath now paints immediately and this only
 * covers it for the length of one lift (~380ms), so the intro is a transition
 * rather than a wait.
 *
 * CSS-driven, not GSAP: a time-based animation always lands on its final
 * frame, so a throttled ticker can never leave the shutter stuck over the
 * whole site.
 */
export default function Preloader({ onDone }) {
  const done = useRef(false)

  useEffect(() => {
    if (prefersReducedMotion()) {
      onDone?.()
      return
    }
    // Failsafe: the shutter covers everything, so it must never be able to
    // stick if `animationend` does not arrive (a backgrounded first load).
    const id = setTimeout(() => {
      if (!done.current) onDone?.()
    }, 900)
    return () => clearTimeout(id)
  }, [onDone])

  const finish = () => {
    if (done.current) return
    done.current = true
    onDone?.()
  }

  return (
    <div
      onAnimationEnd={finish}
      className="preloader fixed inset-0 z-[100] bg-bone"
      role="presentation"
      aria-hidden="true"
    />
  )
}
