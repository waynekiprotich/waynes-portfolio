export default function StudySection({ eyebrow, title, children }) {
  if (!children) return null
  return (
    <section
      data-reveal
      className="grid gap-4 border-b border-line py-10 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-10"
    >
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {title && <h2 className="mt-2 text-[1.05rem] font-medium tracking-tight">{title}</h2>}
      </div>
      <div className="max-w-[68ch] space-y-4 text-[15px] leading-relaxed text-muted">
        {children}
      </div>
    </section>
  )
}
