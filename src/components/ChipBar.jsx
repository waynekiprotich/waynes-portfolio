import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/work', label: 'Selected work and case studies' },
  { to: '/services', label: 'What I build for clients' },
  { to: '/journal', label: 'Notes from the build' },
  { to: '/cv', label: 'Curriculum vitae' },
]

/**
 * Segmented chip row pinned to the top of the page. Scrolls horizontally on
 * narrow screens instead of wrapping into a block of stacked pills — the row
 * is wider than a phone screen by design, so the edge fades below are the
 * only hint that there's more to see, and they track real scroll position
 * rather than just assuming a direction still has content.
 */
export default function ChipBar() {
  const scrollerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const update = () => {
      setCanScrollLeft(el.scrollLeft > 4)
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }

    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 pt-3">
      <div className="shell">
        <div className="shell-inner relative">
          <nav
            ref={scrollerRef}
            aria-label="Sections"
            className="pointer-events-auto flex gap-2 overflow-x-auto pb-1
                       [-ms-overflow-style:none] [scrollbar-width:none]
                       [&::-webkit-scrollbar]:hidden"
          >
            {TABS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `chip min-h-11 shrink-0 whitespace-nowrap backdrop-blur-sm sm:min-h-0 ${
                    isActive ? 'chip-active' : 'bg-ivory/80'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Edge fades hint that the row scrolls; each only shows while
              there's actually more content in that direction. Frosted rather
              than a flat color fade — the bar floats over arbitrary page
              content (a hero image, a card), which a solid-to-transparent
              gradient would show through as a mismatched hard patch. */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r
                        from-ivory/70 to-transparent backdrop-blur-sm
                        transition-opacity duration-150 sm:hidden ${
                          canScrollLeft ? 'opacity-100' : 'opacity-0'
                        }`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l
                        from-ivory/70 to-transparent backdrop-blur-sm
                        transition-opacity duration-150 sm:hidden ${
                          canScrollRight ? 'opacity-100' : 'opacity-0'
                        }`}
          />
        </div>
      </div>
    </div>
  )
}
