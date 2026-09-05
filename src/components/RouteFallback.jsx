export default function RouteFallback() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center" role="status" aria-live="polite">
      <span className="eyebrow">Loading</span>
    </div>
  )
}
