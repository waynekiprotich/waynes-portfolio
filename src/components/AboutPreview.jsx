import { Link } from 'react-router-dom'
import useReveal from '@/hooks/useReveal'
import { SITE } from '@/data/site'

const VALUES = [
  'Real-world usability',
  'Performance',
  'Clean architecture',
  'Responsive interfaces',
  'Maintainable code',
  'Practical technology choices',
]

export default function AboutPreview() {
  const scope = useReveal({ y: 28 })

  return (
    <section ref={scope} aria-labelledby="about-preview" className="shell py-20 sm:py-28">
      <div className="shell-inner grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
        <div data-reveal className="overflow-hidden rounded-card border border-line bg-sand">
          <img
            src="/profile/pfp-720.jpg"
            srcSet="/profile/pfp-480.jpg 480w, /profile/pfp-720.jpg 720w, /profile/pfp-1080.jpg 1080w"
            alt={`Portrait of ${SITE.name}`}
            width="600"
            height="750"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 1024px) 92vw, 42vw"
            className="aspect-[4/5] w-full object-cover transition-transform duration-[700ms]
                       ease-editorial hover:scale-[1.03] motion-reduce:transform-none"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="eyebrow" data-reveal>About</p>

          <h2 id="about-preview" className="mt-4 max-w-[16ch] text-title" data-reveal>
            An engineer in {SITE.location}, working end to end
          </h2>

          <p className="mt-6 max-w-[54ch] text-lede text-muted" data-reveal>
            I move between frontend and backend without much ceremony — designing the data
            model one hour, tuning a transition the next. I care about systems that are
            simple to reason about and safe to change.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2" data-reveal>
            {VALUES.map((value) => (
              <li key={value} className="chip cursor-default">{value}</li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-2" data-reveal>
            <Link to="/about" className="btn btn-ghost">More about me</Link>
            <Link to="/cv" className="btn btn-ghost">Curriculum vitae</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
