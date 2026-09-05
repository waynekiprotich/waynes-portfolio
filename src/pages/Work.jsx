import { useMemo, useState } from 'react'
import SEO from '@/components/SEO'
import PageHeader from '@/components/PageHeader'
import ProjectCard from '@/components/work/ProjectCard'
import ContactCTA from '@/components/ContactCTA'
import useReveal from '@/hooks/useReveal'
import { WORK } from '@/data/work'

export default function Work() {
  const [filter, setFilter] = useState('All')

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(WORK.map((w) => w.category)))],
    []
  )

  const visible = useMemo(
    () => (filter === 'All' ? WORK : WORK.filter((w) => w.category === filter)),
    [filter]
  )

  const scope = useReveal({ y: 26 }, [filter])

  return (
    <>
      <SEO
        title="Work"
        description="Selected projects by Wayne Kiprotich — dashboards, platforms and full-stack applications built for real use."
        path="/work"
      />

      <PageHeader
        eyebrow="Selected work"
        title="Projects"
        lede="Each entry links to a technical case study covering the problem, the architecture, the decisions and what the result actually measured."
      />

      <section ref={scope} className="shell py-12 sm:py-16" aria-label="Project index">
        <div className="shell-inner">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                aria-pressed={filter === category}
                className={`min-h-11 rounded-pill border px-4 py-2 text-[12px] uppercase tracking-[0.14em]
                            transition-colors duration-150 sm:min-h-0 ${
                              filter === category
                                ? 'border-ink bg-ink text-bone'
                                : 'border-line text-muted hover:border-lineStrong hover:text-ink'
                            }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                ratio="aspect-[4/3]"
                priority={i < 3}
                index={i}
              />
            ))}
          </div>

          {visible.length === 0 && (
            <p className="mt-10 text-[14px] text-muted">No projects in this category yet.</p>
          )}
        </div>
      </section>

      <ContactCTA />
    </>
  )
}
