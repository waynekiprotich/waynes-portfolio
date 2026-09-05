import { Link } from '@/lib/router'
import ProjectRow from './ProjectRow'
import useReveal from '@/hooks/useReveal'
import { FEATURED_WORK } from '@/data/work'
import { STATS } from '@/data/site'

export default function SelectedWork() {
  const scope = useReveal({ y: 40, stagger: 0.1 })

  return (
    <section ref={scope} id="work" aria-labelledby="selected-work" className="shell py-16 sm:py-24">
      <div className="shell-inner">
        <h2
          id="selected-work"
          className="mx-auto max-w-[20ch] text-center text-title"
          data-reveal
        >
          A selection of recent projects and shipped work
        </h2>

        <div className="mt-16 space-y-20 sm:space-y-28">
          {FEATURED_WORK.map((project, i) => (
            <ProjectRow key={project.slug} project={project} index={i} priority={i === 0} />
          ))}
        </div>

        <ul className="mt-24 grid grid-cols-1 gap-4 sm:grid-cols-3" data-reveal>
          {STATS.map(({ value, label }) => (
            <li key={label} className="card px-6 py-8 text-center sm:text-left">
              <span className="block text-[clamp(2rem,4vw,3rem)] font-medium tracking-tighter tabular-nums">
                {value}
              </span>
              <span className="mt-2 block text-[13px] text-muted">{label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center" data-reveal>
          <Link to="/work" className="btn btn-ghost">All projects</Link>
        </div>
      </div>
    </section>
  )
}
