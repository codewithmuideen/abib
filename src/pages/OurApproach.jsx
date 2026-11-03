import { Check } from 'lucide-react'
import { images } from '../data/content'
import PageHero from '../components/PageHero'
import { Reveal, RevealGroup, RevealItem } from '../components/Reveal'
import Seo from '../components/Seo'
import Approach from '../sections/Approach'
import CtaBand from '../sections/CtaBand'
import WhyChoose from '../sections/WhyChoose'

const expectations = [
  'A clear understanding of what you need before any work is agreed',
  'Straightforward recommendations that suit the property',
  'Agreed work carried out professionally and with care',
  'Updates throughout, so you always know where things stand',
]

export default function OurApproach() {
  return (
    <>
      <Seo
        title="Our Approach"
        path="/our-approach"
        description="How Abib Plumbing & Building Management Ltd works: understand, assess, deliver and support, with clear communication at every stage."
      />
      <PageHero
        crumb="Our Approach"
        eyebrow="Our Approach"
        title={['How we work,', { text: 'step by step.', className: 'text-sky' }]}
        intro="A simple, dependable process that keeps every project organised and every client informed."
        image={images.approach}
      />

      <Approach id="approach" heading={false} />

      <section className="section bg-paper" aria-labelledby="expect-heading">
        <div className="container grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">What you can expect</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="expect-heading" className="heading-lg mt-5 text-navy">
                Clear communication at every stage.
              </h2>
            </Reveal>
          </div>
          <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {expectations.map((item) => (
              <RevealItem as="li" key={item} className="flex gap-4 rounded-2xl border border-line bg-mist/60 p-6">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-royal text-white">
                  <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="font-medium leading-relaxed text-navy">{item}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <WhyChoose />
      <CtaBand />
    </>
  )
}
