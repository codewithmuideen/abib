import { images } from '../data/content'
import ClipImage from '../components/ClipImage'
import PageHero from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import Seo from '../components/Seo'
import Approach from '../sections/Approach'
import CtaBand from '../sections/CtaBand'
import WhyChoose from '../sections/WhyChoose'

const pillars = [
  {
    title: 'Plumbing',
    text: 'Plumbing services, repairs and installations for residential and commercial properties.',
  },
  {
    title: 'Building',
    text: 'Building and property maintenance that keeps spaces safe, presentable and in good working order.',
  },
  {
    title: 'Management',
    text: 'Organised building management support, with one point of contact and clear communication.',
  },
]

export default function About() {
  return (
    <>
      <Seo
        title="About Us"
        path="/about"
        description="About Abib Plumbing & Building Management Ltd, a Barking-based company providing professional plumbing and building management solutions."
      />
      <PageHero
        crumb="About Us"
        eyebrow="About Abib"
        title={['Reliable expertise.', { text: 'Professional building solutions.', className: 'text-sky' }]}
        intro="We help property owners, managers and occupiers keep their buildings working safely, efficiently and reliably."
        image={images.aboutHero}
      />

      <section className="section bg-paper" aria-labelledby="who-heading">
        <div className="container grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">Who we are</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="who-heading" className="heading-lg mt-5 text-navy">
                Plumbing and building management, under one roof.
              </h2>
            </Reveal>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-muted lg:col-span-7">
            <Reveal>
              <p className="text-xl text-ink">
                Abib Plumbing &amp; Building Management Ltd is a UK company based at Jhumat House on London Road, Barking.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p>
                We bring plumbing and building management together, so clients have a single, dependable partner for
                the practical work that keeps a property running, from water systems and fixtures to the general
                maintenance and coordination that buildings need throughout the year.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p>
                Our focus is simple: listen carefully, recommend sensible solutions, carry out the agreed work
                professionally and keep you informed at every stage.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="container mt-20 grid gap-6 lg:mt-28 lg:grid-cols-12">
          <ClipImage src={images.aboutTeam.src} alt={images.aboutTeam.alt} className="aspect-[16/10] rounded-2xl lg:col-span-7" />
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:col-span-5">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08} className="bg-paper p-7 sm:p-8">
                <p className="font-display text-sm font-bold text-sky">0{i + 1}</p>
                <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-navy">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WhyChoose />
      <Approach id="about-approach" />
      <CtaBand />
    </>
  )
}
