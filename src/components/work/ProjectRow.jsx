import { Link } from '@/lib/router'
import ProjectImage from './ProjectImage'

/**
 * Editorial project row: caption and title on one side, a large rounded image
 * on the other, sides alternating down the page. Everything sits inside the
 * link, so touch devices reach the same place hover users do.
 */
export default function ProjectRow({ project, index = 0, priority = false }) {
  const { title, slug, category, description, tech = [], previewImage, year, status } = project
  const flip = index % 2 === 1

  return (
    <article data-reveal className="group">
      <Link
        to={`/work/${slug}`}
        className="grid items-stretch gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)] md:gap-10"
      >
        <div className={`flex flex-col justify-between gap-8 ${flip ? 'md:order-2' : ''}`}>
          <div>
            <p className="flex items-center gap-3">
              <span className="font-mono text-[12px] text-faint">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="eyebrow">{category}</span>
            </p>
            <p className="mt-4 max-w-[40ch] text-[14px] leading-relaxed text-muted">
              {description}
            </p>
          </div>

          <div>
            <h3
              className="text-project transition-transform duration-300 ease-editorial
                         group-hover:translate-x-2 motion-reduce:transform-none"
            >
              {title}
            </h3>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              {tech.slice(0, 4).map((t) => (
                <span key={t} className="text-[12px] text-faint">{t}</span>
              ))}
              {(status || year) && (
                <span className="text-[12px] text-muted">{status || year}</span>
              )}
            </p>
          </div>
        </div>

        <div
          className={`relative aspect-[4/3] w-full overflow-hidden rounded-card border border-line
                      bg-sand sm:aspect-[16/10] ${flip ? 'md:order-1' : ''}`}
        >
          <ProjectImage
            src={previewImage}
            alt={`${title} — ${category} interface`}
            title={title}
            priority={priority}
          />
        </div>
      </Link>
    </article>
  )
}
