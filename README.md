# Wayne Kiprotich — Portfolio

Frontend-only portfolio. No backend, no database, no CMS: every piece of
content is a local data file.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run lint
```

## Stack

React 18 · Vite · Tailwind CSS · React Router · GSAP (ScrollTrigger) ·
Lenis · react-helmet-async. Nothing else — a four-line helper beats a package.

## Where content lives

| File | Holds |
| --- | --- |
| `src/data/site.js` | Identity, contact links, stats, services, process, capabilities |
| `src/data/projects.json` | Catalogue entry per project (title, category, tech, links, image) |
| `src/data/caseStudies.js` | Long-form write-up per project, joined to the catalogue on `id` |
| `src/data/blog.json` | Journal entries |
| `src/data/work.js` | Joins the two project files; sets the homepage feature order |

Five of the six case studies still contain `[PLACEHOLDER]` copy carried over
from the previous site. The marker is stripped before display and those pages
carry a visible "write-up in progress" note (`isDraft` in `src/data/work.js`),
rather than presenting draft text as finished. Replace the copy and the note
disappears on its own.

## Project imagery

Screenshots live in `public/projects/`, referenced by `previewImage`. A project
without one renders a typographic placeholder at the same aspect ratio, so a
real screenshot drops in without touching the layout.

## Theme

Light and dark share one set of semantic tokens (`--c-bone`, `--c-ivory`,
`--c-sand`, `--c-ink`, `--c-muted`, `--c-faint`, `--c-sky`, `--c-line-rgb`) in
`src/styles/index.css`; dark mode swaps the variables, so no component carries
a `dark:` class of its own. `--c-muted`/`--c-faint` are tuned to clear WCAG AA
(4.5:1) against both `bone` and `ivory` in both themes — check that with any
further palette change, since it's a tighter constraint than it looks.

Resolution order: an explicit choice (the toggle in `NavDock`, via
`src/theme/`) beats the OS preference, which is the fallback for no-JS
clients via a `prefers-color-scheme` media block. A blocking inline script in
`index.html` applies the resolved theme before first paint — no flash — and
keeps `#theme-color-meta` in sync for the browser-chrome tint. The favicon
also has its own light/dark PNG pair, swapped via `media` on the `<link>`
tags, independent of the site's own toggle (it follows the browser/OS, since
a browser tab can't see our app state).

## Motion

Split deliberately, by what happens when the animation *doesn't* run:

- **Page intros and scroll reveals are CSS**, triggered by mount and by
  `IntersectionObserver` (`src/hooks/useReveal.js`). Content must never depend
  on an animation frame to become visible — a throttled ticker would otherwise
  leave the page blank.
- **GSAP/ScrollTrigger drives only the scrubbed effects** — hero parallax and
  the process rail. If they never run, the page is simply static.
- The preloader has a 5s failsafe, since it covers the whole site.
- Everything is skipped under `prefers-reduced-motion`. Lenis is skipped there
  too, and on coarse pointers, which leaves native mobile momentum and
  back/forward scroll restoration untouched.
