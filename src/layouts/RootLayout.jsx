import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Preloader from '@/components/Preloader'
import NavDock from '@/components/NavDock'
import ChipBar from '@/components/ChipBar'
import Footer from '@/components/Footer'
import Grain from '@/components/Grain'
import useLenis, { getLenis } from '@/hooks/useLenis'
import { ScrollTrigger } from '@/lib/motion'

export default function RootLayout({ children }) {
  const { pathname } = useLocation()
  const [revealed, setRevealed] = useState(
    () => typeof sessionStorage !== 'undefined' && sessionStorage.getItem('wk:intro') === 'seen'
  )

  useLenis()

  // Reset scroll position on navigation, then let ScrollTrigger re-measure
  // the newly mounted page.
  useEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname])

  const handleIntroDone = useCallback(() => {
    setRevealed(true)
    try {
      sessionStorage.setItem('wk:intro', 'seen')
    } catch {
      /* private mode — the intro simply plays again */
    }
  }, [])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110]
                   focus:bg-ink focus:px-4 focus:py-2 focus:text-base"
      >
        Skip to content
      </a>

      {!revealed && <Preloader onDone={handleIntroDone} />}
      <Grain />

      <div
        className="transition-opacity duration-300"
        style={{ opacity: revealed ? 1 : 0 }}
        aria-hidden={!revealed}
      >
        <ChipBar />
        <main id="main">{children}</main>
        <Footer />
      </div>

      <NavDock />
    </>
  )
}
