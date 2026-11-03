import { services } from '../data/content'
import Button from '../components/Button'
import { Reveal, RevealGroup } from '../components/Reveal'
import ServiceCard from '../components/ServiceCard'

export default function ServicesGrid() {
  return (
    <section className="section bg-mist" aria-labelledby="services-heading">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">Our Services</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="services-heading" className="heading-lg mt-5 text-navy">
                Plumbing and building services, managed properly.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16} className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-muted">
              Support for residential, commercial and managed properties, from everyday plumbing to the ongoing care of
              entire buildings.
            </p>
            <Button to="/services" variant="outline" className="mt-6">
              View all services
            </Button>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3" gap={0.1}>
          {services.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
