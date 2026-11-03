import { Building2, Globe, Mail, MapPin, Phone, Users } from 'lucide-react'
import { company, maps } from '../../shared/company'
import { RevealGroup, RevealItem } from './Reveal'

const items = [
  { icon: Building2, label: 'Company', value: company.name },
  {
    icon: MapPin,
    label: 'Address',
    value: company.address,
    href: maps.search,
    external: true,
  },
  { icon: Phone, label: 'Telephone', value: company.phone, href: company.phoneHref, strong: true },
  { icon: Mail, label: 'General enquiries', value: company.email, href: `mailto:${company.email}` },
  { icon: Users, label: 'HR enquiries', value: company.hrEmail, href: `mailto:${company.hrEmail}` },
  { icon: Globe, label: 'Website', value: company.website, href: company.url },
]

export default function ContactDetails() {
  return (
    <RevealGroup as="dl" className="divide-y divide-line border-y border-line">
      {items.map(({ icon: Icon, label, value, href, external, strong }) => (
        <RevealItem key={label} className="flex gap-4 py-5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-royal/[0.08] text-royal">
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</dt>
            <dd className={`mt-1 break-words ${strong ? 'font-display text-xl font-bold' : 'font-medium'} text-navy`}>
              {href ? (
                <a
                  href={href}
                  className="link-draw transition-colors hover:text-royal"
                  {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  {value}
                  {external && <span className="sr-only"> (opens Google Maps in a new tab)</span>}
                </a>
              ) : (
                value
              )}
            </dd>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  )
}
