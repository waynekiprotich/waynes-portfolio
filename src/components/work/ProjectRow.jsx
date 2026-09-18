import { useEffect, useRef } from 'react'
import { Link } from '@/lib/router'
import { gsap, prefersReducedMotion } from '@/lib/motion'
import ProjectImage from './ProjectImage'

/**
 * Editorial project row: caption and title on one side, a large rounded image
 * on the other, sides alternating down the page. Everything sits inside the
 * link, so touch devices reach the same place hover users do.
 *
 * Motion: the frame opens from an inset as it scrolls in and, on fine
 * pointers, tilts in 3D toward the cursor. The screenshot itself never moves
 * inside the frame, so it always fits edge to edge.
 */
export default function ProjectRow({ project, index = 0, priority = false }) {
  const { title, slug, category, description, tech = [], previewImage, year, status } = project
  const flip = index % 2 === 1
  const frame = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        frame.current,
        { clipPath: 'inset(9% 7% 9% 7% round 28px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 20px)',
          ease: 'none',
          scrollTrigger: { trigger: frame.current, start: 'top 95%', end: 'top 45%', scrub: 0.5 },
        }
      )
    }, frame)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const el = frame.current
    if (!el || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' })
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      ry(((e.clientX - r.left) / r.width - 0.5) * 7)
      rx(-((e.clientY - r.top) / r.height - 0.5) * 7)
    }
    const onLeave = () => {
      rx(0)
      ry(0)
    }
    gsap.set(el, { transformPerspective: 1100 })
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

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
          ref={frame}
          className={`relative aspect-[16/9] w-full overflow-hidden rounded-card border border-line
                      bg-sand will-change-transform ${flip ? 'md:order-1' : ''}`}
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
