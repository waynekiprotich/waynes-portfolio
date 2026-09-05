import SEO from '@/components/SEO'
import PageHeader from '@/components/PageHeader'
import ContactCTA from '@/components/ContactCTA'
import useReveal from '@/hooks/useReveal'
import posts from '@/data/blog.json'

export default function Journal() {
  const scope = useReveal({ y: 22 })

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
            <ol className="border-t border-line">
              {posts.map(({ id, title, excerpt, category, date }, i) => (
                <li key={id} data-reveal className="group border-b border-line">
                  <article className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-[auto_minmax(0,10rem)_1fr] sm:gap-10">
                    <span className="font-mono text-[12px] text-faint sm:pt-2">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="eyebrow sm:pt-2.5">{date}</p>
                    <div>
                      <h2 className="text-[clamp(1.2rem,2.2vw,1.75rem)] font-medium tracking-tight">
                        {title}
                      </h2>
                      <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-muted">
                        {excerpt}
                      </p>
                      <p className="mt-4 text-[12px] text-faint">{category}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <ContactCTA />
    </>
  )
}
