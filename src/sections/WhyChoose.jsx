import { values } from '../data/content'
import Button from '../components/Button'
import { Reveal, RevealGroup, RevealItem } from '../components/Reveal'

export default function WhyChoose({ cta = true }) {
  return (
    <section className="section relative overflow-hidden bg-navy text-white grain" aria-labelledby="why-heading">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-royal/25 blur-[120px]"
      />
      <div className="container relative grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <p className="eyebrow eyebrow-light">Why choose us</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="why-heading" className="heading-lg mt-5">
                Professional Service. Dependable Solutions.
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                The way we work matters as much as the work itself. These are the standards we hold ourselves to on every
                job.
              </p>
            </Reveal>
            {cta && (
              <Reveal delay={0.22} className="mt-9">
                <Button to="/contact" variant="accent">
                  Talk to our team
                </Button>
              </Reveal>
            )}
          </div>
        </div>

        <RevealGroup as="ul" className="grid border-l border-t border-white/10 sm:grid-cols-2 lg:col-span-8" gap={0.08}>
          {values.map(({ title, icon: Icon, text }, i) => (
            <RevealItem
              as="li"
              key={title}
              className="group relative border-b border-r border-white/10 p-7 transition-colors duration-500 hover:bg-white/[0.035] sm:p-9"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-sky transition-all duration-500 group-hover:border-sky group-hover:bg-sky group-hover:text-navy">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-display text-sm font-bold text-white/25" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-8 font-display text-xl font-bold tracking-tight">{title}</h3>
              <p className="mt-3 leading-relaxed text-white/65">{text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
