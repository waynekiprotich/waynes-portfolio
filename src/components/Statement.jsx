import useReveal from '@/hooks/useReveal'

const TAGS = [
  'Real-world usability',
  'Performance',
  'Clean architecture',
  'Maintainable code',
  'Practical choices',
  'Responsive interfaces',
]

/** Large centred statement with the working principles as a pill row. */
export default function Statement() {
  const scope = useReveal({ y: 26, stagger: 0.06 })

  return (
    <section ref={scope} aria-labelledby="statement" className="shell py-24 sm:py-32">
      <div className="shell-inner">
        <h2
          id="statement"
          className="mx-auto max-w-[22ch] text-center text-statement sm:max-w-[24ch]"
          data-reveal
        >
          I build software for real use — chosen for the problem, measured after it ships,
          and simple enough to change later.
        </h2>

        <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-2" data-reveal>
          {TAGS.map((tag) => (
            <li key={tag} className="chip cursor-default">{tag}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
