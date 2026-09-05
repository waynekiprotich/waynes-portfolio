import { Link } from '@/lib/router'
import SectionHeading from './SectionHeading'
import useReveal from '@/hooks/useReveal'
import posts from '@/data/blog.json'

export default function JournalPreview() {
  const scope = useReveal({ y: 22 })
  if (!posts.length) return null

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

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map(({ id, title, excerpt, category, date }) => (
            <li key={id} data-reveal>
              <Link
                to="/journal"
                className="card group flex h-full flex-col gap-4 p-6 transition-colors duration-200
                           ease-editorial hover:border-lineStrong"
              >
                <p className="flex items-center gap-3">
                  <span className="eyebrow">{date}</span>
                  <span className="text-[12px] text-faint">{category}</span>
                </p>
                <h3 className="text-[clamp(1.1rem,1.8vw,1.4rem)] font-medium tracking-tight
                               transition-transform duration-200 ease-editorial
                               group-hover:translate-x-1 motion-reduce:transform-none">
                  {title}
                </h3>
                <p className="text-[14px] leading-relaxed text-muted">{excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
