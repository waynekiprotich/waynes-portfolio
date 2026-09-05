export default function SectionHeading({ eyebrow, title, lede, aside, id, centered = false }) {
  if (centered) {
    return (
      <header className="text-center">
        {eyebrow && <p className="eyebrow" data-reveal>{eyebrow}</p>}
        <h2 id={id} className="mx-auto mt-4 max-w-[20ch] text-title" data-reveal>{title}</h2>
        {lede && (
          <p className="mx-auto mt-5 max-w-[54ch] text-lede text-muted" data-reveal>{lede}</p>
        )}
        {aside && <div className="mt-8 flex justify-center" data-reveal>{aside}</div>}
      </header>
    )
  }

  return (
    <header className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        {eyebrow && <p className="eyebrow" data-reveal>{eyebrow}</p>}
        <h2 id={id} className="mt-4 max-w-[18ch] text-title" data-reveal>{title}</h2>
        {lede && <p className="mt-5 max-w-[54ch] text-lede text-muted" data-reveal>{lede}</p>}
      </div>
      {aside && <div data-reveal>{aside}</div>}
    </header>
  )
}
