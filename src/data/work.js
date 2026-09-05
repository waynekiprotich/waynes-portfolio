import projects from './projects.json'
import { caseStudies } from './caseStudies'

/**
 * projects.json holds the catalogue entry; caseStudies.js holds the long-form
 * write-up. They are joined on id so neither file has to repeat the other.
 */
export const WORK = projects.map((project) => {
  const study = caseStudies.find((c) => c.id === project.id)
  return {
    ...project,
    slug: study?.slug ?? String(project.id),
    status: study?.status ?? null,
    year: study?.completionDate?.split(' ').pop() ?? null,
    hasCaseStudy: Boolean(study),
  }
})

/** Homepage order, largest editorial weight first. */
const FEATURE_ORDER = ['apexgrid', 'stack-battle-ke', 'tasknova', 'vaultora', 'atmosiq', 'mercora']

export const FEATURED_WORK = FEATURE_ORDER
  .map((slug) => WORK.find((w) => w.slug === slug))
  .filter(Boolean)

export const getWork = (slug) => WORK.find((w) => w.slug === slug)
export const getCaseStudy = (slug) => caseStudies.find((c) => c.slug === slug)

export { caseStudies }

/**
 * Five of the six case studies still carry `[PLACEHOLDER]` copy from the
 * original portfolio. The marker is stripped so paragraphs read cleanly, and
 * `isDraft` lets the page say so rather than passing draft text off as final.
 */
export const stripMarker = (value) =>
  typeof value === 'string' ? value.replace(/\[PLACEHOLDER\]\s*/g, '') : value

export const isDraft = (study) =>
  JSON.stringify(study ?? {}).includes('[PLACEHOLDER]')
