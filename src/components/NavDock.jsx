import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from '@/lib/router'
import ThemeToggle from './ThemeToggle'

const LINKS = [
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]

/**
 * Floating bottom-centre control.
 *
 * Two different controls rather than one scaled down: on a phone the four
 * links sit in the pill permanently, because a collapsed pill would expand
 * wider than the screen. From `sm` up it is a compact pill that expands in
 * place — no overlay, so the interaction is the same for pointer and touch.
 * The theme toggle stays visible at every width; it is one icon, not a menu.
 */
export default function NavDock() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [lastPath, setLastPath] = useState(pathname)
  const wrap = useRef(null)

  // Collapse on navigation, adjusted during render rather than in an effect
  // so it never causes a second render pass.
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onPointer = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  return (
    <div
      ref={wrap}
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center
                 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <nav
        aria-label="Primary"
        className="flex max-w-full items-center gap-0.5 rounded-pill border border-line
                   bg-ivory/85 p-1 shadow-[0_10px_30px_var(--shadow-dock)] backdrop-blur-md sm:gap-1"
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Collapse menu' : 'Expand menu'}
          className="hidden h-9 shrink-0 items-center gap-2 rounded-pill px-4 text-[13px]
                     text-ink transition-colors duration-150 hover:bg-ink/5 sm:flex"
        >
          <span
            className={`h-1.5 w-1.5 rounded-full bg-ink transition-transform duration-200 ${
              open ? 'scale-150' : ''
            }`}
            aria-hidden="true"
          />
          Menu
        </button>

        <div
          className={`flex items-center gap-0.5 overflow-hidden sm:gap-1
                      sm:transition-[max-width,opacity] sm:duration-300 sm:ease-editorial ${
                        open
                          ? 'sm:visible sm:max-w-[34rem] sm:opacity-100'
                          // `invisible` and not just zero width: a collapsed
                          // link must leave the tab order, not sit there
                          // invisible and still focusable.
                          : 'sm:invisible sm:max-w-0 sm:opacity-0'
                      }`}
        >
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                // h-11 (44px) on a phone, where these four links are always
                // visible and are the primary way to navigate; h-9 once a
                // pointer is the more likely input.
                `flex h-11 shrink-0 items-center whitespace-nowrap rounded-pill px-3 text-[13px]
                 transition-colors duration-150 sm:h-9 sm:px-4 ${
                   isActive ? 'bg-ink text-bone' : 'text-muted hover:bg-ink/5 hover:text-ink'
                 }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <span className="mx-0.5 h-5 w-px shrink-0 bg-line" aria-hidden="true" />
        <ThemeToggle />
      </nav>
    </div>
  )
}
