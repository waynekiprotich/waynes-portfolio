import { useEffect, useState } from 'react'
import SEO from '@/components/SEO'
import PageHeader from '@/components/PageHeader'
import ContactCTA from '@/components/ContactCTA'
import useReveal from '@/hooks/useReveal'
import { useLocation } from '@/lib/router'
import { trackSpotlight } from '@/lib/spotlight'
import posts from '@/data/blog.json'

const Chevron = ({ open }) => (
  <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform duration-300 ease-editorial
       ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

export default function Journal() {
  const scope = useReveal({ y: 22 })
  const { hash } = useLocation()
  // Arriving from a card on the home page opens that entry; otherwise the
  // newest one is open so there is something to read straight away.
  const [open, setOpen] = useState(() => hash.slice(1) || posts[0]?.slug || null)
  const [prevHash, setPrevHash] = useState(hash)
  if (hash !== prevHash) {
    setPrevHash(hash)
    if (hash.slice(1)) setOpen(hash.slice(1))
  }

  useEffect(() => {
    const slug = hash.slice(1)
    if (!slug) return
    // After RootLayout's scroll-to-top on navigation.
    const id = setTimeout(() => {
      document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 350)
    return () => clearTimeout(id)
  }, [hash])

  return (
    <>
      <SEO
        title="Journal"
        description="Notes on engineering, architecture and interface work by Wayne Kiprotich."
        path="/journal"
      />

      <PageHeader
        eyebrow="Journal"
        title="Notes from the build"
        lede="Write-ups on architecture, interface work and the decisions behind the projects."
      />

      <section ref={scope} className="shell py-16 sm:py-20" aria-label="Journal index">
        <div className="shell-inner">
          {posts.length === 0 ? (
            <p className="text-[15px] text-muted">No entries published yet.</p>
          ) : (
            <ol className="grid gap-4">
              {posts.map(({ id, slug, title, excerpt, category, date, dateTime, readTime, tags = [], content = [] }, i) => {
                const isOpen = open === slug
                const bodyId = `${slug}-body`
                return (
                  <li key={id} id={slug} data-reveal className="scroll-mt-28">
                    <article
                      onPointerMove={trackSpotlight}
                      className="card spot-card group relative overflow-hidden p-6 sm:p-10"
                    >
                      <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-12">
                        <span
                          aria-hidden="true"
                          className="select-none font-medium leading-none tracking-tighter text-ink/[0.08]
                                     text-[clamp(3.5rem,8vw,7rem)]"
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>

                        <div>
                          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="inline-flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-sky" aria-hidden="true" />
                              <span className="eyebrow">{category}</span>
                            </span>
                            <time dateTime={dateTime} className="text-[12px] text-faint">{date}</time>
                            {readTime && <span className="text-[12px] text-faint">· {readTime}</span>}
                          </p>

                          <h2 className="mt-4 text-[clamp(1.4rem,3vw,2.5rem)] font-medium leading-[1.1] tracking-tight">
                            {title}
                          </h2>
                          <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed text-muted">{excerpt}</p>

                          {tags.length > 0 && (
                            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Topics">
                              {tags.map((tag) => (
                                <li key={tag} className="rounded-pill border border-line px-3 py-1 text-[12px] text-muted">
                                  {tag}
                                </li>
                              ))}
                            </ul>
                          )}

                          {content.length > 0 && (
                            <>
                              <div className="expand" data-open={isOpen} id={bodyId} aria-hidden={!isOpen}>
                                <div>
                                  <div className="mt-8 max-w-[64ch] space-y-5 border-l border-line pl-5 sm:pl-8">
                                    {content.map((paragraph, p) => (
                                      <p
                                        key={p}
                                        className={`text-[16px] leading-[1.75] text-ink/85 transition-all duration-500
                                                    ease-editorial motion-reduce:transition-none
                                                    ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                                        style={{ transitionDelay: isOpen ? `${120 + p * 70}ms` : '0ms' }}
                                      >
                                        {paragraph}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => setOpen(isOpen ? null : slug)}
                                aria-expanded={isOpen}
                                aria-controls={bodyId}
                                className="btn btn-ghost mt-8"
                              >
                                {isOpen ? 'Close note' : 'Read the note'}
                                <Chevron open={isOpen} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ol>
          )}
        </div>
      </section>

      <ContactCTA />
    </>
  )
}
