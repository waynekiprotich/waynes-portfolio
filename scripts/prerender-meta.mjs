/**
 * Writes a per-route copy of the built index.html with that route's real
 * <title>, description, canonical and og/twitter tags baked in.
 *
 * Why: react-helmet-async sets those tags after React runs. Google executes
 * JS and sees them, but link unfurlers — Slack, iMessage, WhatsApp, LinkedIn,
 * Twitter — do not. Before this, sharing a case study anywhere showed the
 * generic site title, because vercel.json rewrites every path to the one
 * index.html. Vercel checks the filesystem before applying a rewrite, so
 * dist/work/apexgrid/index.html wins for /work/apexgrid and the SPA still
 * boots from the identical script tags.
 *
 * This is metadata only — it is not content prerendering, so it does not
 * change first paint. Case-study metadata is read from the same data module
 * the page renders from, so the two cannot drift.
 */
import { createServer } from 'vite'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const DIST = 'dist'

// Static routes. Titles mirror the `title` each page passes to <SEO>; a route
// with no description falls back to the site default already in index.html.
const STATIC_ROUTES = [
  { path: '/work', title: 'Work' },
  { path: '/about', title: 'About' },
  { path: '/services', title: 'Services' },
  { path: '/estimator', title: 'Estimator' },
  { path: '/journal', title: 'Journal' },
  { path: '/cv', title: 'Curriculum vitae' },
  { path: '/contact', title: 'Contact' },
]

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Replace the content of a meta tag matched by attribute, if present. */
function setMeta(html, attr, name, content) {
  const pattern = new RegExp(`(<meta\\s+${attr}="${name}"\\s+content=")[^"]*(")`, 'i')
  return html.replace(pattern, `$1${escapeHtml(content)}$2`)
}

function buildHtml(base, { title, description, url, image }) {
  let html = base.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`)
  html = html.replace(
    /(<link rel="canonical" href=")[^"]*(")/i,
    `$1${escapeHtml(url)}$2`
  )
  html = setMeta(html, 'property', 'og:title', title)
  html = setMeta(html, 'property', 'og:url', url)
  html = setMeta(html, 'name', 'twitter:title', title)
  if (description) {
    html = setMeta(html, 'name', 'description', description)
    html = setMeta(html, 'property', 'og:description', description)
    html = setMeta(html, 'name', 'twitter:description', description)
  }
  if (image) {
    html = setMeta(html, 'property', 'og:image', image)
    html = setMeta(html, 'name', 'twitter:image', image)
  }
  return html
}

// Vite resolves the `@/` alias and the JSON import for us, so the data is read
// exactly as the app reads it rather than being re-parsed here.
const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'silent',
})
const { caseStudies, stripMarker } = await server.ssrLoadModule('/src/data/work.js')
const { SITE } = await server.ssrLoadModule('/src/data/site.js')
await server.close()

const base = await readFile(path.join(DIST, 'index.html'), 'utf8')

const routes = [
  ...STATIC_ROUTES,
  ...caseStudies.map((study) => ({
    path: `/work/${study.slug}`,
    title: study.title,
    description: stripMarker(study.subtitle),
    image: study.heroImage ? `${SITE.url}${study.heroImage}` : undefined,
  })),
]

for (const route of routes) {
  const html = buildHtml(base, {
    // Matches SEO.jsx: `${title} — ${SITE.name}`.
    title: `${route.title} — ${SITE.name}`,
    description: route.description,
    url: `${SITE.url}${route.path}`,
    image: route.image,
  })
  const dir = path.join(DIST, route.path)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, 'index.html'), html)
}

console.log(`prerendered meta for ${routes.length} routes`)
