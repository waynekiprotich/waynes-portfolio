import { Link } from 'react-router-dom'
import { SITE } from '@/data/site'

const NAV = [
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/estimator', label: 'Estimator' },
  { to: '/journal', label: 'Journal' },
  { to: '/cv', label: 'CV' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="shell pb-32 pt-20 sm:pb-28">
      <div className="shell-inner rule pt-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="text-[15px] font-medium text-ink">{SITE.name}</p>
            <p className="mt-1 text-[15px] text-muted">{SITE.role}</p>
            <p className="mt-4 text-[13px] text-faint">{SITE.location}</p>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow">Index</p>
            <ul className="mt-4 space-y-2">
              {NAV.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="link-underline inline-block -my-2 py-2 text-[14px] text-muted transition-colors duration-150 hover:text-ink"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow">Elsewhere</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a href={SITE.github} target="_blank" rel="noreferrer noopener" className="link-underline inline-block -my-2 py-2 text-[14px] text-muted transition-colors duration-150 hover:text-ink">GitHub</a>
              </li>
              <li>
                <a href={SITE.linkedin} target="_blank" rel="noreferrer noopener" className="link-underline inline-block -my-2 py-2 text-[14px] text-muted transition-colors duration-150 hover:text-ink">LinkedIn</a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="link-underline inline-block -my-2 py-2 text-[14px] text-muted transition-colors duration-150 hover:text-ink">{SITE.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-faint">
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="text-[12px] text-faint">Designed and built in {SITE.location}.</p>
        </div>
      </div>
    </footer>
  )
}
