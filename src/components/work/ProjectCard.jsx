import { Link } from '@/lib/router'
import ProjectImage from './ProjectImage'

/** Grid variant, used on the work index where projects are browsed side by side. */
export default function ProjectCard({ project, priority = false, index }) {
  const { title, slug, category, description, tech = [], previewImage, year, status } = project

  return (
    <article className="group h-full" data-reveal>
      <Link
        to={`/work/${slug}`}
        className="card flex h-full flex-col overflow-hidden transition-colors duration-200
                   ease-editorial hover:border-lineStrong"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand">
          <ProjectImage
            src={previewImage}
            alt={`${title} — ${category} interface`}
            title={title}
            priority={priority}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-[clamp(1.15rem,1.6vw,1.5rem)] font-medium tracking-tight
                           transition-transform duration-300 ease-editorial
                           group-hover:translate-x-1 motion-reduce:transform-none">
              {title}
            </h3>
            {typeof index === 'number' && (
              <span className="font-mono text-[11px] text-faint">
                {String(index + 1).padStart(2, '0')}
              </span>
            )}
          </div>

          <p className="max-w-[44ch] text-[14px] leading-relaxed text-muted">{description}</p>

          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-3">
            <span className="eyebrow">{category}</span>
            {tech.slice(0, 2).map((t) => (
              <span key={t} className="text-[12px] text-faint">{t}</span>
            ))}
            {(status || year) && (
              <span className="ml-auto text-[12px] text-muted">{status || year}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
