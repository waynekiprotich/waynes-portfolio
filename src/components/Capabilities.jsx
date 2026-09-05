import SectionHeading from './SectionHeading'
import useReveal from '@/hooks/useReveal'
import { CAPABILITIES } from '@/data/site'

export default function Capabilities() {
  const scope = useReveal({ y: 24 })

  return (
    <section ref={scope} aria-labelledby="capabilities" className="shell py-20 sm:py-28">
      <div className="shell-inner">
        <SectionHeading
          centered
          id="capabilities"
          eyebrow="Capabilities"
          title="The stack I reach for, and why it stays small"
          lede="Fewer moving parts, chosen because they suit the problem rather than because they are new."
        />

        <dl className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map(({ group, items }) => (
            <div key={group} data-reveal className="card flex flex-col gap-5 p-6">
              <dt className="eyebrow">{group}</dt>
              <dd className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className="chip cursor-default">{item}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
