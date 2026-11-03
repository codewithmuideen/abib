import { Info } from 'lucide-react'
import { portfolio } from '../data/content'
import { Reveal, RevealGroup, RevealItem } from '../components/Reveal'

export default function Portfolio() {
  return (
    <section className="section bg-mist" aria-labelledby="work-heading">
      <div className="container">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">Our Work</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="work-heading" className="heading-lg mt-5 text-navy">
                The kind of spaces we look after.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16} className="lg:col-span-5">
            <p className="flex gap-3 border-l-2 border-sky pl-4 text-sm leading-relaxed text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-royal" aria-hidden="true" />
              Illustrative imagery showing the types of environment we work in. Photographs of Abib projects will be added
              here as they become available.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid auto-rows-[280px] gap-4 sm:grid-cols-2 lg:mt-20 lg:auto-rows-[300px] lg:grid-cols-12" gap={0.1}>
          {portfolio.map((item) => (
            <RevealItem key={item.title} as="figure" className={`group relative overflow-hidden rounded-2xl bg-navy ${item.span}`}>
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-[1.4s] ease-premium group-hover:scale-[1.06]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky">{item.category}</span>
                <span className="mt-2 block translate-y-1 font-display text-xl font-bold transition-transform duration-500 ease-premium group-hover:translate-y-0 sm:text-2xl">
                  {item.title}
                </span>
                <span className="mt-3 block h-px w-10 bg-sky transition-[width] duration-700 ease-premium group-hover:w-24" aria-hidden="true" />
              </figcaption>
              <span className="absolute right-4 top-4 rounded-full bg-navy/60 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-wider text-white/80 backdrop-blur">
                Illustrative
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
