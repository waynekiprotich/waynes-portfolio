import { useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './theme-context'

const STORAGE_KEY = 'wk:theme'

const readStoredTheme = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null // Private mode — treated as "no explicit choice yet".
  }
}

const readSystemTheme = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

/**
 * Resolves to `explicit ?? system`. The two are tracked separately — rather
 * than collapsing straight to one `theme` value — so a visitor who has never
 * toggled keeps following their OS setting live, and only a real click ever
 * writes to storage.
 */
export function ThemeProvider({ children }) {
  const [explicit, setExplicit] = useState(readStoredTheme)
  const [systemTheme, setSystemTheme] = useState(readSystemTheme)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => setSystemTheme(e.matches ? 'dark' : 'light')
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const theme = explicit ?? systemTheme

  // The blocking script in index.html already resolved and applied this
  // before first paint, so this just keeps the DOM and the meta tag in sync
  // on every change thereafter (including a live OS-level switch).
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    const meta = document.getElementById('theme-color-meta')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#171613' : '#EFECE5')
  }, [theme])

  const toggleTheme = useCallback(() => {
    setExplicit((current) => {
      const next = (current ?? systemTheme) === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* Choice just won't persist across a reload. */
      }
      return next
    })
  }, [systemTheme])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
