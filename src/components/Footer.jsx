import { Link } from 'react-router-dom'
import { ArrowUp, Globe, Mail, MapPin, Phone } from 'lucide-react'
import { company, maps } from '../../shared/company'
import { services } from '../data/content'
import Logo from './Logo'
import { navLinks } from '../data/navigation'

function Column({ title, className, children }) {
  return (
    <div className={className}>
      <h2 className="mb-5 font-display text-eyebrow font-semibold uppercase text-sky">{title}</h2>
      {children}
    </div>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-navy-deep text-white/70 print:hidden">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky/60 to-transparent" />

      <div className="container grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:py-24">
        <div className="sm:col-span-2 lg:col-span-4">
          <Logo tone="white" className="h-11" />
          <p className="mt-6 max-w-sm leading-relaxed">
            Professional plumbing and building management solutions, helping properties operate safely, efficiently and
            reliably.
          </p>
          <a
            href={company.phoneHref}
            className="mt-8 inline-flex items-center gap-3 font-display text-2xl font-bold text-white transition-colors hover:text-sky"
          >
            <Phone className="h-5 w-5 text-sky" aria-hidden="true" />
            {company.phone}
          </a>
        </div>

        <Column title="Company" className="lg:col-span-2">
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="link-draw transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/request-a-quote" className="link-draw transition-colors hover:text-white">
                Request a Quote
              </Link>
            </li>
          </ul>
        </Column>

        <div className="lg:col-span-3">
          <Column title="Services">
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services#${s.slug}`} className="link-draw transition-colors hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Column>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <Column title="Contact">
            <address className="space-y-4 not-italic">
              <a href={maps.search} target="_blank" rel="noopener noreferrer" className="flex gap-3 transition-colors hover:text-white">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky" aria-hidden="true" />
                <span>
                  {company.addressLines.slice(0, 2).join(', ')},
                  <br />
                  {company.addressLines.slice(2).join(', ')}
                </span>
              </a>
              <a href={company.phoneHref} className="flex gap-3 transition-colors hover:text-white">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sky" aria-hidden="true" />
                {company.phone}
              </a>
              <a href={`mailto:${company.email}`} className="flex gap-3 break-all transition-colors hover:text-white">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky" aria-hidden="true" />
                <span>
                  {company.email}
                  <span className="block text-xs text-white/45">General enquiries</span>
                </span>
              </a>
              <a href={`mailto:${company.hrEmail}`} className="flex gap-3 break-all transition-colors hover:text-white">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky" aria-hidden="true" />
                <span>
                  {company.hrEmail}
                  <span className="block text-xs text-white/45">Recruitment &amp; HR</span>
                </span>
              </a>
              <a href={company.url} className="flex gap-3 transition-colors hover:text-white">
                <Globe className="mt-0.5 h-4 w-4 shrink-0 text-sky" aria-hidden="true" />
                {company.website}
              </a>
            </address>
          </Column>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/privacy-policy" className="link-draw hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/first-week-review" className="link-draw hover:text-white">
              Staff: First Week Review
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 text-white transition-colors hover:text-sky"
            >
              Back to top <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
