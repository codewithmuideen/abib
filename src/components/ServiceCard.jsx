import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { RevealItem } from './Reveal'

export default function ServiceCard({ service, index }) {
  const Icon = service.icon
  return (
    <RevealItem as="article" className="h-full">
      <Link
        to={`/services#${service.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-[transform,box-shadow,border-color] duration-500 ease-premium hover:-translate-y-1.5 hover:border-transparent hover:shadow-lift"
      >
        <div className="relative aspect-[16/11] overflow-hidden">
          <img
            src={service.image.src}
            alt={service.image.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-premium group-hover:scale-[1.07]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
          <span className="absolute left-5 top-5 font-display text-sm font-bold text-white/90">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="absolute bottom-5 left-5 grid h-11 w-11 place-items-center rounded-full bg-paper text-royal transition-colors duration-500 group-hover:bg-sky group-hover:text-navy">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <h3 className="font-display text-xl font-bold tracking-tight text-navy">{service.title}</h3>
          <p className="mt-3 flex-1 leading-relaxed text-muted">{service.summary}</p>
          <span className="mt-6 inline-flex items-center gap-2 font-display text-[0.78rem] font-bold uppercase tracking-[0.14em] text-royal">
            Learn more
            <span className="sr-only"> about {service.title}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-premium group-hover:translate-x-1.5" aria-hidden="true" />
          </span>
        </div>
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-sky transition-transform duration-700 ease-premium group-hover:scale-x-100"
        />
      </Link>
    </RevealItem>
  )
}
