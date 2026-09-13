import { useMemo, useState } from 'react'
import SEO from '@/components/SEO'
import PageHeader from '@/components/PageHeader'
import { SITE } from '@/data/site'
import {
  PROJECT_TYPES,
  TIMELINES,
  BUDGETS,
  WIZARD_STEPS,
  INITIAL_ESTIMATOR_DATA,
} from '@/utils/estimatorConfig'

/**
 * Scoping tool. Everything lives in local state until "Send brief", which
 * posts to /api/estimate (a Vercel function that forwards it to Discord). If
 * that fails, the visitor can still send the same brief by email.
 */
export default function Estimator() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState(INITIAL_ESTIMATOR_DATA)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [honeypot, setHoneypot] = useState('')

  const set = (patch) => setData((d) => ({ ...d, ...patch }))
  const setContact = (patch) => setData((d) => ({ ...d, contact: { ...d.contact, ...patch } }))

  const complete = useMemo(
    () => ({
      1: Boolean(data.contact.fullName.trim() && data.contact.email.trim()),
      2: Boolean(data.projectType && data.description.trim()),
      3: Boolean(data.timeline && data.budget),
    }),
    [data]
  )

  const summary = useMemo(() => {
    const type = PROJECT_TYPES.find((t) => t.id === data.projectType)?.label
    const timeline = TIMELINES.find((t) => t.id === data.timeline)?.label
    return [
      ['Name', data.contact.fullName],
      ['Email', data.contact.email],
      ['Phone', data.contact.phone],
      ['Project type', type],
      ['Timeline', timeline],
      ['Budget', data.budget],
      ['Brief', data.description],
    ].filter(([, v]) => v)
  }, [data])

  const mailto = useMemo(() => {
    const body = summary.map(([label, value]) => `${label}: ${value}`).join('\n')
    return `mailto:${SITE.email}?subject=${encodeURIComponent(
      'Project enquiry — ' + (data.contact.fullName || 'New enquiry')
    )}&body=${encodeURIComponent(body)}`
  }, [summary, data.contact.fullName])

  const allDone = complete[1] && complete[2] && complete[3]

  const sendBrief = async () => {
    if (!allDone || status === 'sending') return
    setStatus('sending')
    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.contact.fullName,
          email: data.contact.email,
          phone: data.contact.phone,
          projectType: PROJECT_TYPES.find((t) => t.id === data.projectType)?.label,
          timeline: TIMELINES.find((t) => t.id === data.timeline)?.label,
          budget: data.budget,
          description: data.description,
          company: honeypot,
        }),
      })
      setStatus(response.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <SEO
        title="Estimator"
        description="Outline a project brief — type, timeline and budget — and send it straight through."
        path="/estimator"
      />

      <PageHeader
        eyebrow="Estimator"
        title="Scope a project"
        lede="Three short steps. Nothing is sent until you press Send brief, and you can review everything in the summary first."
      />

      <section className="shell py-14 sm:py-20" aria-label="Project estimator">
        <div className="shell-inner grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          <div>
            {/* Step rail */}
            <ol className="flex flex-wrap gap-px overflow-hidden rounded-card border border-line bg-line" aria-label="Steps">
              {WIZARD_STEPS.map(({ id, title, eyebrow }) => (
                <li key={id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => setStep(id)}
                    aria-current={step === id ? 'step' : undefined}
                    className={`flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors duration-150 ${
                      step === id ? 'bg-ink text-bone' : 'bg-ivory text-muted hover:text-ink'
                    }`}
                  >
                    <span className="text-[11px] uppercase tracking-[0.16em] opacity-70">
                      {eyebrow}
                    </span>
                    <span className="text-[14px]">{title}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-10">
              {step === 1 && (
                <fieldset className="space-y-6">
                  <legend className="eyebrow">Who is asking</legend>
                  <Field
                    label="Full name"
                    value={data.contact.fullName}
                    onChange={(v) => setContact({ fullName: v })}
                    required
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={data.contact.email}
                    onChange={(v) => setContact({ email: v })}
                    required
                  />
                  <Field
                    label="Phone (optional)"
                    type="tel"
                    value={data.contact.phone}
                    onChange={(v) => setContact({ phone: v })}
                  />
                </fieldset>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <Choice
                    legend="Project type"
                    options={PROJECT_TYPES}
                    value={data.projectType}
                    onChange={(v) => set({ projectType: v })}
                  />
                  <div>
                    <label htmlFor="brief" className="eyebrow">Brief</label>
                    <textarea
                      id="brief"
                      rows={6}
                      value={data.description}
                      onChange={(e) => set({ description: e.target.value })}
                      placeholder="What should it do, and who has to use it?"
                      // 16px, not 15: iOS Safari auto-zooms the viewport on
                      // focusing any input under 16px, which then has to be
                      // manually zoomed back out.
                      className="mt-3 w-full rounded-[14px] border border-line bg-ivory px-4 py-3
                                 text-base text-ink placeholder:text-faint
                                 focus:border-lineStrong focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <Choice
                    legend="Timeline"
                    options={TIMELINES}
                    value={data.timeline}
                    onChange={(v) => set({ timeline: v })}
                  />
                  <Choice
                    legend="Budget range"
                    options={BUDGETS.map((b) => ({ id: b, label: b }))}
                    value={data.budget}
                    onChange={(v) => set({ budget: v })}
                  />
                </div>
              )}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-6">
              <button
                type="button"
                className="btn btn-ghost disabled:opacity-40"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-ghost disabled:opacity-40"
                onClick={() => setStep((s) => Math.min(WIZARD_STEPS.length, s + 1))}
                disabled={step === WIZARD_STEPS.length}
              >
                Next
              </button>
              <button
                type="button"
                onClick={sendBrief}
                disabled={!allDone || status === 'sending' || status === 'sent'}
                className="btn btn-solid disabled:opacity-40"
              >
                {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Brief sent' : 'Send brief'}
              </button>
              {/* Honeypot for bots; hidden from people and assistive tech. */}
              <input
                type="text"
                name="company"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />
            </div>

            <p className="mt-4 min-h-[1.5em] text-[14px] text-muted" role="status" aria-live="polite">
              {status === 'sent' && 'Thanks, your brief is in. I will reply by email.'}
              {status === 'error' && (
                <>
                  That did not go through.{' '}
                  <a href={mailto} className="underline underline-offset-4 hover:text-ink">
                    Send it by email instead
                  </a>
                  .
                </>
              )}
            </p>
          </div>

          {/* Live summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Brief summary">
            <p className="eyebrow">Your brief</p>
            <dl className="mt-5 border-t border-line">
              {summary.length === 0 && (
                <p className="py-4 text-[14px] text-faint">Nothing filled in yet.</p>
              )}
              {summary.map(([label, value]) => (
                <div key={label} className="border-b border-line py-3">
                  <dt className="text-[11px] uppercase tracking-[0.16em] text-faint">{label}</dt>
                  <dd className="mt-1 text-[14px] leading-relaxed text-ink/85">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-[13px] leading-relaxed text-faint">
              A firm figure follows discovery. This step is about scope, not a quote.
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}

function Field({ label, value, onChange, type = 'text', required = false }) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, '-')
  return (
    <div>
      <label htmlFor={id} className="eyebrow">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        // 16px, not 15 — see the textarea above for why.
        className="mt-3 w-full rounded-[14px] border border-line bg-ivory px-4 py-3 text-base
                   text-ink placeholder:text-faint focus:border-lineStrong focus:outline-none"
      />
    </div>
  )
}

function Choice({ legend, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="eyebrow">{legend}</legend>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={value === id}
            className={`min-h-11 rounded-pill border px-4 py-2.5 text-[13px] transition-colors duration-150 sm:min-h-0 ${
              value === id
                ? 'border-ink bg-ink text-bone'
                : 'border-line text-muted hover:border-lineStrong hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
