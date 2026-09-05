import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion'

let lenisInstance = null
export const getLenis = () => lenisInstance

/**
 * Smooth scrolling driven by GSAP's ticker so ScrollTrigger stays in sync.
 * Skipped for reduced-motion and coarse pointers, which leaves native mobile
 * momentum, anchor jumps and back/forward restoration untouched.
 */
export default function useLenis() {
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (prefersReducedMotion() || coarse) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisInstance = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])
}

export function stopLenis() {
  lenisInstance?.stop()
  document.documentElement.classList.add('lenis-stopped')
}

export function startLenis() {
  lenisInstance?.start()
  document.documentElement.classList.remove('lenis-stopped')
}
