import { Check } from 'lucide-react'
import { services, images } from '../data/content'
import Button from '../components/Button'
import ClipImage from '../components/ClipImage'
import PageHero from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import Seo from '../components/Seo'
import Approach from '../sections/Approach'
import CtaBand from '../sections/CtaBand'

export default function Services() {
  return (
    <>
      <Seo
        title="Services"
        path="/services"
        description="Plumbing services, plumbing repairs, installations, building maintenance, property maintenance and building management solutions from Abib Ltd, Barking."
      />
      <PageHero
        crumb="Services"
        eyebrow="Our Services"
        title={['Services that keep', { text: 'properties performing.', className: 'text-sky' }]}
        intro="Plumbing and building management support for residential, commercial and managed properties."
        image={images.services}
      >
        <nav aria-label="Services on this page" className="flex flex-wrap gap-2">
          {services.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition-colors hover:border-sky hover:bg-sky hover:text-navy"
            >
              {s.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <section className="bg-paper" aria-label="Service details">
        {services.map((service, i) => {
          const Icon = service.icon
          const flip = i % 2 === 1
          return (
            <article
              key={service.slug}
              id={service.slug}
              className={`scroll-mt-28 border-b border-line py-20 lg:py-28 ${i % 2 ? 'bg-mist' : 'bg-paper'}`}
              aria-labelledby={`${service.slug}-title`}
            >
              <div className="container grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
                <ClipImage
                  src={service.image.src}
                  alt={service.image.alt}
                  from={flip ? 'right' : 'left'}
                  className={`aspect-[4/3] rounded-2xl lg:col-span-6 ${flip ? 'lg:order-2' : ''}`}
                />
                <div className="lg:col-span-6">
                  <Reveal className="flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-royal text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-sm font-bold text-muted">
                      {String(i + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                    </span>
                  </Reveal>
                  <Reveal delay={0.08}>
                    <h2 id={`${service.slug}-title`} className="heading-lg mt-6 text-navy">
                      {service.title}
                    </h2>
                  </Reveal>
                  <Reveal delay={0.14}>
                    <p className="lead mt-5">{service.summary}</p>
                    <p className="mt-4 leading-relaxed text-muted">{service.detail}</p>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                      {service.points.map((p) => (
                        <li key={p} className="flex items-center gap-3 font-medium text-navy">
                          <Check className="h-4 w-4 shrink-0 text-sky" strokeWidth={3} aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                  <Reveal delay={0.26} className="mt-10">
                    <Button to={`/request-a-quote?service=${encodeURIComponent(service.title)}`}>Request a quote</Button>
                  </Reveal>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <Approach id="services-approach" />
      <CtaBand />
    </>
  )
}
