/**
 * Project imagery slot. Real screenshots live in /public/projects; when one is
 * missing the slot renders a typographic placeholder at the same aspect ratio,
 * so dropping a screenshot in later changes nothing about the layout.
 */
export default function ProjectImage({
  src,
  alt,
  title,
  priority = false,
  sizes = '(max-width: 768px) 92vw, 60vw',
}) {
  if (!src) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-sand" aria-hidden="true">
        <span className="text-[11px] uppercase tracking-[0.3em] text-faint">{title}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : undefined}
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover object-top
                 transition-transform duration-[700ms] ease-editorial
                 group-hover:scale-[1.05] motion-reduce:transform-none"
    />
  )
}
