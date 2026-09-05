import { Link, Navigate, useParams } from '@/lib/router'
import SEO from '@/components/SEO'
import StudySection from '@/components/case-study/StudySection'
import CodeBlock from '@/components/case-study/CodeBlock'
import ContactCTA from '@/components/ContactCTA'
import useReveal from '@/hooks/useReveal'
import { caseStudies, getCaseStudy, isDraft, stripMarker, WORK } from '@/data/work'

export default function CaseStudy() {
  const { slug } = useParams()
  const study = getCaseStudy(slug)
  const scope = useReveal({ y: 22 }, [slug])

  if (!study) return <Navigate to="/work" replace />

  const draft = isDraft(study)
  const text = stripMarker

  const index = caseStudies.findIndex((c) => c.slug === slug)
  const next = caseStudies[(index + 1) % caseStudies.length]
  const project = WORK.find((w) => w.slug === slug)
  const gallery = study.screenshots?.length
    ? study.screenshots
    : (study.gallery || []).map((url) => ({ url, caption: study.title }))

  const facts = [
    ['Role', study.roles?.join(', ')],
    ['Duration', study.duration],
    ['Team', study.team],
    ['Status', study.status],
    ['Platform', study.platform],
    ['Completed', study.completionDate],
  ].filter(([, value]) => value)

  return (
    <>
      <SEO
        title={study.title}
        description={text(study.subtitle)}
        path={`/work/${study.slug}`}
        type="article"
        image={study.heroImage ? `https://www.waynekiprotich.online${study.heroImage}` : undefined}
      />

      <article ref={scope}>
        <header className="shell pt-32 pb-12 sm:pt-40">
          <div className="shell-inner">
            <Link
              to="/work"
              className="eyebrow link-underline -my-3 inline-block py-3 text-muted hover:text-ink"
            >
              Back to work
            </Link>

            <h1 className="mt-8 max-w-[14ch] text-[clamp(2.5rem,8vw,6rem)] font-medium leading-[0.95] tracking-tighter">{study.title}</h1>
            <p className="mt-6 max-w-[58ch] text-lede text-muted">{text(study.subtitle)}</p>

            {draft && (
              <p className="mt-6 inline-flex items-center gap-2 rounded-pill border border-line
                            bg-ivory px-4 py-2 text-[12px] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-sky" aria-hidden="true" />
                Write-up in progress — some sections are still draft copy.
              </p>
            )}

            <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-3 lg:grid-cols-6">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="eyebrow">{label}</dt>
                  <dd className="mt-1.5 text-[14px] text-ink/85">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        {study.heroImage && (
          <div className="shell">
            <div className="shell-inner">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-card border border-line bg-sand">
                <img
                  src={study.heroImage}
                  alt={`${study.title} interface`}
                  sizes="(max-width: 768px) 100vw, 1440px"
                  fetchpriority="high"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        )}

        <div className="shell py-16 sm:py-20">
          <div className="shell-inner border-t border-line">
            <StudySection eyebrow="01" title="Overview">
              <p>{text(study.overview)}</p>
            </StudySection>

            <StudySection eyebrow="02" title="Problem">
              <p>{text(study.problem)}</p>
            </StudySection>

            {study.objectives?.length > 0 && (
              <StudySection eyebrow="03" title="Objectives">
                <ul className="space-y-2">
                  {study.objectives.map((o) => (
                    <li key={o} className="border-l border-line pl-4">{text(o)}</li>
                  ))}
                </ul>
              </StudySection>
            )}

            {study.features?.length > 0 && (
              <StudySection eyebrow="04" title="Solution">
                <ul className="space-y-2">
                  {study.features.map((f) => (
                    <li key={f} className="border-l border-line pl-4">{text(f)}</li>
                  ))}
                </ul>
              </StudySection>
            )}

            {study.technologies?.length > 0 && (
              <StudySection eyebrow="05" title="Technology">
                <p className="flex flex-wrap gap-x-5 gap-y-2">
                  {study.technologies.map((t) => (
                    <span key={t} className="text-[15px] text-ink/85">{t}</span>
                  ))}
                </p>
              </StudySection>
            )}

            <StudySection eyebrow="06" title="Architecture">
              <>
                {study.architectureStyle && (
                  <p className="text-ink/85">{text(study.architectureStyle)}</p>
                )}
                {study.architecture && <p>{text(study.architecture)}</p>}
                {study.database && <p><span className="text-ink/80">Data. </span>{text(study.database)}</p>}
                {study.api && <p><span className="text-ink/80">API. </span>{text(study.api)}</p>}
                {study.authentication && (
                  <p><span className="text-ink/80">Auth. </span>{text(study.authentication)}</p>
                )}
              </>
            </StudySection>

            <StudySection eyebrow="07" title="Key engineering decisions">
              <>
                {study.performance && (
                  <p><span className="text-ink/80">Performance. </span>{text(study.performance)}</p>
                )}
                {study.accessibility && (
                  <p><span className="text-ink/80">Accessibility. </span>{text(study.accessibility)}</p>
                )}
                {study.security && (
                  <p><span className="text-ink/80">Security. </span>{text(study.security)}</p>
                )}
                {study.tradeOffs && (
                  <p><span className="text-ink/80">Trade-offs. </span>{text(study.tradeOffs)}</p>
                )}
              </>
            </StudySection>

            <StudySection eyebrow="08" title="Challenges">
              <>
                <p>{text(study.challenges)}</p>
                {study.lessonsLearned && <p>{text(study.lessonsLearned)}</p>}
              </>
            </StudySection>

            {study.codeSnippets?.length > 0 && (
              <StudySection eyebrow="09" title="Code">
                <div className="space-y-6">
                  {study.codeSnippets.map((snippet) => (
                    <CodeBlock key={snippet.title} {...snippet} />
                  ))}
                </div>
              </StudySection>
            )}

            {study.metrics?.length > 0 && (
              <StudySection eyebrow="10" title="Results">
                <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                  {study.metrics.map(({ label, value }) => (
                    <div key={label} className="border-l border-line pl-4">
                      <dt className="text-[12px] text-faint">{label}</dt>
                      <dd className="mt-1 text-[clamp(1.2rem,2.2vw,1.75rem)] font-medium tracking-tight text-ink">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </StudySection>
            )}

            {gallery.length > 0 && (
              <StudySection eyebrow="11" title="Gallery">
                <div className="grid gap-4 sm:grid-cols-2">
                  {gallery.map(({ url, caption }) => (
                    <figure key={url} className="overflow-hidden rounded-card border border-line bg-ivory">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={url}
                          alt={caption || study.title}
                          loading="lazy"
                          decoding="async"
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="absolute inset-0 h-full w-full object-cover object-top"
                        />
                      </div>
                      {caption && (
                        <figcaption className="border-t border-line px-4 py-2.5 text-[12px] text-faint">
                          {caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </StudySection>
            )}

            <StudySection eyebrow="12" title="Links">
              <div className="flex flex-wrap gap-3">
                {(study.liveDemo || project?.liveHref) && (
                  <a
                    href={study.liveDemo || project.liveHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-solid"
                  >
                    Live demo
                  </a>
                )}
                {(study.github || project?.codeHref) && (
                  <a
                    href={study.github || project.codeHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-ghost"
                  >
                    Source
                  </a>
                )}
                {study.documentation && (
                  <a
                    href={study.documentation}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-ghost"
                  >
                    Documentation
                  </a>
                )}
              </div>
            </StudySection>
          </div>
        </div>

        <nav className="shell py-14" aria-label="Case study navigation">
          <div className="shell-inner">
            <p className="eyebrow">Next project</p>
            <Link
              to={`/work/${next.slug}`}
              className="group mt-4 inline-flex items-baseline gap-4 text-title"
            >
              <span className="transition-transform duration-200 ease-editorial group-hover:translate-x-2 motion-reduce:transform-none">
                {next.title}
              </span>
            </Link>
          </div>
        </nav>
      </article>

      <ContactCTA />
    </>
  )
}
