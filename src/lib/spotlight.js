/**
 * Pointer handler for `.spot-card`: writes the cursor position to CSS
 * variables so a soft glow follows it. No React state, no layout thrash
 * beyond one rect read per event.
 */
export function trackSpotlight(event) {
  if (event.pointerType !== 'mouse') return
  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  el.style.setProperty('--my', `${event.clientY - rect.top}px`)
}
