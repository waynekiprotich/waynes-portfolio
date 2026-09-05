import SEO from '@/components/SEO'
import PageHeader from '@/components/PageHeader'
import { SITE } from '@/data/site'

export default function CV() {
  return (
    <>
      <SEO
        title="CV"
        description={`Curriculum vitae for ${SITE.name}, ${SITE.role}.`}
        path="/cv"
      />

      <PageHeader
        eyebrow="Curriculum vitae"
        title="CV"
        lede="Read it here or take the PDF."
        meta={
          <div className="flex flex-wrap gap-3">
            <a href={SITE.cv} download className="btn btn-solid">Download PDF</a>
            <a href={SITE.cv} target="_blank" rel="noreferrer noopener" className="btn btn-ghost">
              Open in new tab
            </a>
          </div>
        }
      />

      <section className="shell py-12 sm:py-16" aria-label="Curriculum vitae document">
        <div className="shell-inner">
          <div className="overflow-hidden rounded-card border border-line bg-ivory">
            <object
              data={`${SITE.cv}#view=FitH`}
              type="application/pdf"
              title={`${SITE.name} curriculum vitae`}
              className="h-[70vh] min-h-[520px] w-full"
            >
              <div className="flex h-[40vh] flex-col items-center justify-center gap-4 p-8 text-center">
                <p className="text-[15px] text-muted">
                  Your browser cannot display the PDF inline.
                </p>
                <a href={SITE.cv} download className="btn btn-solid">Download PDF</a>
              </div>
            </object>
          </div>
        </div>
      </section>
    </>
  )
}
