import { Link } from '@/lib/router'
import SectionHeading from './SectionHeading'
import useReveal from '@/hooks/useReveal'
import { trackSpotlight } from '@/lib/spotlight'
import posts from '@/data/blog.json'

const Arrow = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export default function JournalPreview() {
  const scope = useReveal({ y: 22 })
  if (!posts.length) return null

  const latest = posts.slice(0, 3)
  // A lone entry gets the full width instead of sitting in a third of a grid.
  const single = latest.length === 1

  return (
    <section ref={scope} aria-labelledby="journal-preview" className="shell py-20 sm:py-28">
      <div className="shell-inner">
        <SectionHeading
          centered
          id="journal-preview"
          eyebrow="Journal"
          title="Notes from the build"
          aside={<Link to="/journal" className="btn btn-ghost">All entries</Link>}
        />

        <ul className={`mt-14 grid gap-4 ${single ? '' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
          {latest.map(({ id, slug, title, excerpt, category, date, dateTime, readTime, tags = [] }, i) => (
            <li key={id} data-reveal>
              <Link
                to={`/journal#${slug}`}
                onPointerMove={trackSpotlight}
                className={`card spot-card group relative flex h-full flex-col overflow-hidden p-6 sm:p-8
                            ${single ? 'lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-start lg:gap-12 lg:p-12' : 'gap-5'}`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none select-none font-medium leading-none tracking-tighter text-ink/[0.07]
                             text-[clamp(4rem,9vw,8rem)] transition-transform duration-500 ease-editorial
                             group-hover:-translate-y-1 motion-reduce:transform-none"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="flex flex-col gap-4">
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky" aria-hidden="true" />
                      <span className="eyebrow">{category}</span>
                    </span>
                    <time dateTime={dateTime} className="text-[12px] text-faint">{date}</time>
                    {readTime && <span className="text-[12px] text-faint">· {readTime}</span>}
                  </p>

                  <h3 className="text-[clamp(1.3rem,2.6vw,2.25rem)] font-medium leading-[1.1] tracking-tight
                                 transition-transform duration-300 ease-editorial
                                 group-hover:translate-x-1 motion-reduce:transform-none">
                    {title}
                  </h3>
                  <p className="max-w-[60ch] text-[15px] leading-relaxed text-muted">{excerpt}</p>

                  {tags.length > 0 && (
                    <ul className="mt-1 flex flex-wrap gap-2" aria-label="Topics">
                      {tags.map((tag) => (
                        <li key={tag} className="rounded-pill border border-line px-3 py-1 text-[12px] text-muted">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <span
                  className="mt-6 inline-flex items-center gap-2 self-start rounded-pill border border-line
                             px-4 py-2 text-[13px] font-medium text-ink transition-colors duration-200
                             group-hover:border-ink group-hover:bg-ink group-hover:text-bone lg:mt-0"
                >
                  Read the note
                  <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1 motion-reduce:transform-none">
                    <Arrow />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
