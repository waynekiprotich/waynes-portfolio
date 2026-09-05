/**
 * Fixed film-grain layer, generated as an inline SVG feTurbulence data URI so
 * it costs no request and no image weight.
 */
const NOISE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
      <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter>
      <rect width="160" height="160" filter="url(#n)" opacity="0.5"/>
    </svg>`
  )

export default function Grain() {
  return (
    <div
      aria-hidden="true"
      className="grain pointer-events-none fixed inset-0 z-[60]"
      style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: '160px 160px' }}
    />
  )
}
