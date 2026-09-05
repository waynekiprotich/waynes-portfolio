import { Fragment } from 'react'

/** Page-level heading. Intro motion is CSS; see styles/index.css. */
export default function PageHeader({ eyebrow, title, lede, meta }) {
  const words = String(title).split(' ')

  return (
    <header className="shell pb-12 pt-32 sm:pb-16 sm:pt-40">
      <div className="shell-inner">
        {eyebrow && (
          <p className="eyebrow" data-intro-fade style={{ animationDelay: '0.05s' }}>
            {eyebrow}
          </p>
        )}

        <h1 className="mt-5 text-[clamp(2.5rem,8vw,6.5rem)] font-medium leading-[0.95] tracking-tighter">
          {/* A real space between words, not padding: padding looks the same
              but leaves the accessible name reading as one run-on word. */}
          {words.map((word, i) => (
            <Fragment key={`${word}-${i}`}>
              <span className="inline-block overflow-hidden align-bottom">
                <span
                  data-word
                  className="inline-block"
                  style={{ animationDelay: `${0.08 + i * 0.07}s` }}
                >
                  {word}
                </span>
              </span>
              {i < words.length - 1 && ' '}
            </Fragment>
          ))}
        </h1>

        {lede && (
          <p className="mt-8 max-w-[58ch] text-lede text-muted" data-intro-fade style={{ animationDelay: '0.3s' }}>
            {lede}
          </p>
        )}
        {meta && (
          <div className="mt-8" data-intro-fade style={{ animationDelay: '0.38s' }}>
            {meta}
          </div>
        )}
      </div>
    </header>
  )
}
