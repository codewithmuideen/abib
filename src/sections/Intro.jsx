import { Check } from 'lucide-react'
import { images } from '../data/content'
import Button from '../components/Button'
import ClipImage from '../components/ClipImage'
import { Reveal, RevealGroup, RevealItem } from '../components/Reveal'

const focus = ['Plumbing for homes and commercial premises', 'Building and property maintenance', 'Organised building management support']

export default function Intro() {
  return (
    <section className="section overflow-hidden bg-paper" aria-labelledby="intro-heading">
      <div className="container grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-6 lg:pr-10">
          <ClipImage
            src={images.about.src}
            alt={images.about.alt}
            className="aspect-[4/5] w-[86%] rounded-2xl sm:aspect-[5/6]"
          />
          <ClipImage
            src={images.aboutSecondary.src}
            alt={images.aboutSecondary.alt}
            from="left"
            delay={0.25}
            className="absolute -bottom-10 right-0 aspect-square w-[48%] rounded-2xl border-[6px] border-paper shadow-lift sm:-bottom-12"
          />
          <Reveal delay={0.5} className="absolute left-[8%] top-8 hidden rounded-xl bg-navy px-5 py-4 text-white shadow-lift sm:block">
            <p className="font-display text-eyebrow font-semibold uppercase text-sky">Abib Ltd</p>
            <p className="mt-1 font-display text-sm font-semibold">Plumbing · Building · Management</p>
          </Reveal>
        </div>

        <div className="pt-6 lg:col-span-6 lg:pl-6 lg:pt-0">
          <Reveal>
            <p className="eyebrow">About Abib</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="intro-heading" className="heading-lg mt-5 text-navy">
              Reliable Expertise. Professional Building Solutions.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="lead mt-7">
              Abib Plumbing &amp; Building Management Ltd is a UK company based in Barking, London, providing plumbing and
              building management solutions for residential and commercial properties.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="mt-5 leading-relaxed text-muted">
              We work with property owners, managers and occupiers to understand what each building needs, agree a
              practical approach and carry out the work with care. Clear communication runs through everything we do,
              so you always know where things stand.
            </p>
          </Reveal>

          <RevealGroup as="ul" className="mt-9 space-y-0 border-t border-line" delay={0.3}>
            {focus.map((item) => (
              <RevealItem as="li" key={item} className="flex items-center gap-4 border-b border-line py-4 font-medium text-navy">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-royal/10 text-royal">
                  <Check className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
                </span>
                {item}
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.35} className="mt-10">
            <Button to="/about" variant="dark">
              More about us
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
