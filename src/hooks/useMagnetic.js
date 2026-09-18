import { useEffect } from 'react'

/**
 * Delegated magnetic pull for every `[data-magnetic]` element: it leans a
 * few pixels toward the pointer and springs back on leave. One listener for
 * the whole page, transform only, fine pointers only.
 */
export default function useMagnetic() {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    let active = null
    const release = (el) => {
      el.style.transition = 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)'
      el.style.transform = ''
    }
    const onMove = (e) => {
      const el = e.target.closest?.('[data-magnetic]')
      if (active && active !== el) release(active)
      active = el
      if (!el) return
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * 0.28
      const y = (e.clientY - (r.top + r.height / 2)) * 0.36
      el.style.transition = 'transform 150ms ease-out'
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    const onLeave = () => active && release(active)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])
}
