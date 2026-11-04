import { ShieldCheck } from 'lucide-react'
import { values } from '../data/content'
import Button from '../components/Button'
import ClipImage from '../components/ClipImage'
import { Reveal, RevealGroup, RevealItem } from '../components/Reveal'

const photo = (name) => `/images/photos/${name}.webp`

export default function WhyChoose({ cta = true, tone = 'paper' }) {
  return (
    <section
      className={`section relative overflow-hidden ${tone === 'mist' ? 'bg-mist' : 'bg-paper'}`}
      aria-labelledby="why-heading"
    >
      <div
        aria-hidden="true"
        className="absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-sky/10 blur-[110px]"
      />
      <div className="container relative grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Photo composition */}
        <div className="relative order-2 lg:order-1 lg:col-span-5">
          <ClipImage
            src={photo('worker-portrait')}
            alt="Tradesperson in a hard hat and safety glasses standing beside a service panel"
            className="aspect-[4/5] rounded-3xl shadow-lift"
            imgClassName="object-[20%_center]"
          />
          <ClipImage
            src={photo('bright-bathroom')}
            alt="Bright modern bathroom with round mirrors, basin and freestanding bath"
            from="left"
            delay={0.25}
            className="absolute -bottom-8 -right-4 hidden aspect-square w-[46%] rounded-3xl border-[6px] border-paper shadow-lift sm:block lg:-right-10"
          />
          <Reveal
            delay={0.45}
            className="absolute -left-3 top-8 flex items-center gap-3 rounded-2xl bg-navy px-5 py-4 text-white shadow-lift sm:-left-6"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-sky text-navy">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-sm font-bold">Professional service</span>
              <span className="block text-xs text-white/70">Dependable solutions</span>
            </span>
          </Reveal>
        </div>

        {/* Values */}
        <div className="order-1 lg:order-2 lg:col-span-7">
          <Reveal>
            <p className="eyebrow">Why choose us</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="why-heading" className="heading-lg mt-5 text-navy">
              Professional Service. <span className="text-royal">Dependable Solutions.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              The way we work matters as much as the work itself. These are the standards we hold ourselves to on every
              job.
            </p>
          </Reveal>

          <RevealGroup as="ul" className="mt-10 grid gap-4 sm:grid-cols-2" gap={0.07}>
            {values.map(({ title, icon: Icon, text }) => (
              <RevealItem
                as="li"
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-line bg-mist/50 p-6 transition-[transform,box-shadow,background-color,border-color] duration-500 ease-premium hover:-translate-y-1 hover:border-transparent hover:bg-paper hover:shadow-lift"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-royal text-white transition-colors duration-500 group-hover:bg-sky group-hover:text-navy">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-navy">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{text}</p>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-royal to-sky transition-transform duration-700 ease-premium group-hover:scale-x-100"
                />
              </RevealItem>
            ))}
          </RevealGroup>

          {cta && (
            <Reveal delay={0.2} className="mt-10">
              <Button to="/contact" variant="primary">
                Talk to our team
              </Button>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
