import { useState } from 'react'
import { MapPin, Navigation } from 'lucide-react'
import { company, maps } from '../../shared/company'

/**
 * Google Maps is only loaded after the visitor asks for it, so no
 * third-party requests are made on page load.
 */
export default function MapEmbed({ className = '' }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-line bg-mist ${className}`}>
      {loaded ? (
        <iframe
          title={`Map showing ${company.address}`}
          src={maps.embed}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[linear-gradient(rgb(var(--c-line))_1px,transparent_1px),linear-gradient(90deg,rgb(var(--c-line))_1px,transparent_1px)] bg-[size:36px_36px] p-6 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-royal text-white shadow-lift">
            <MapPin className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display font-bold text-navy">{company.addressLines.slice(0, 2).join(', ')}</p>
            <p className="text-muted">{company.addressLines.slice(2).join(', ')}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setLoaded(true)}
              className="rounded-xl border border-navy/20 bg-paper px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy"
            >
              Show map
            </button>
            <a
              href={maps.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-royal"
            >
              <Navigation className="h-4 w-4" aria-hidden="true" /> Get directions
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </a>
          </div>
          <p className="max-w-xs text-xs text-muted">Showing the map loads content from Google.</p>
        </div>
      )}
    </div>
  )
}
