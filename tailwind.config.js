/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic, role-based tokens backed by CSS variables (see
        // styles/index.css). Dark mode swaps the variables, not the classes —
        // no component needs a `dark:` variant of its own.
        bone:       'rgb(var(--c-bone) / <alpha-value>)',
        ivory:      'rgb(var(--c-ivory) / <alpha-value>)',
        sand:       'rgb(var(--c-sand) / <alpha-value>)',
        ink:        'rgb(var(--c-ink) / <alpha-value>)',
        muted:      'rgb(var(--c-muted) / <alpha-value>)',
        faint:      'rgb(var(--c-faint) / <alpha-value>)',
        sky:        'rgb(var(--c-sky) / <alpha-value>)',
        line:       'rgb(var(--c-line-rgb) / 0.12)',
        lineStrong: 'rgb(var(--c-line-rgb) / 0.28)',
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        display: ['clamp(3rem, 13vw, 12rem)', { lineHeight: '0.9', letterSpacing: '-0.045em' }],
        statement: ['clamp(1.75rem, 4.4vw, 4rem)', { lineHeight: '1.08', letterSpacing: '-0.035em' }],
        title: ['clamp(1.6rem, 3.4vw, 3rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        project: ['clamp(1.6rem, 4vw, 3.5rem)', { lineHeight: '1', letterSpacing: '-0.035em' }],
        lede: ['clamp(1rem, 1.1vw + 0.7rem, 1.25rem)', { lineHeight: '1.55' }],
        micro: ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.14em' }],
      },
      borderRadius: {
        card: '20px',
        pill: '999px',
      },
      maxWidth: { shell: '1500px' },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
