export default function CodeBlock({ title, language, code }) {
  return (
    <figure className="overflow-hidden rounded-card border border-line bg-ivory">
      <figcaption className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="text-[13px] text-ink/80">{title}</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
          {language}
        </span>
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-ink/85">
        <code>{code}</code>
      </pre>
    </figure>
  )
}
