import { createContext } from 'react'

// Split into its own module so ThemeProvider.jsx and useTheme.js each export
// only what Fast Refresh expects (a component, and a hook, respectively).
export const ThemeContext = createContext(null)
