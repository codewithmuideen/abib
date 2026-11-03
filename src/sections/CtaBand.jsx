import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Phone } from 'lucide-react'
import { company } from '../../shared/company'
import { images } from '../data/content'
import Button from '../components/Button'
import PipeLine from '../components/PipeLine'
import { Reveal } from '../components/Reveal'
import SplitText from '../components/SplitText'

export default function CtaBand() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-18%', '0%'])

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-navy text-white" aria-labelledby="cta-heading">
      <motion.img
        src={images.cta.src}
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-20 h-[124%] w-full object-cover"
        style={{ y }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/85 via-navy/45 to-navy/5" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-navy/50 to-transparent lg:hidden" />
      <PipeLine inView className="pointer-events-none absolute -bottom-10 right-4 -z-10 h-[420px] text-white/20 lg:right-[8%]" delay={0.2} />

      <div className="container grid gap-12 py-20 sm:py-24 lg:grid-cols-12 lg:items-end lg:py-32">
        <div className="lg:col-span-8">
          <Reveal>
            <p className="eyebrow eyebrow-light">Start a conversation</p>
          </Reveal>
          <SplitText
            as="h2"
            inView
            id="cta-heading"
            lines={["Let's Talk About", 'Your Next Project.']}
            className="heading-xl mt-6 lg:text-[4.75rem] xl:text-[5.25rem]"
          />
          <Reveal delay={0.2}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/80">
              Get in touch with {company.name} to discuss your plumbing or building management requirements.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.3} className="lg:col-span-4">
          <a href={company.phoneHref} className="group mb-8 block">
            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Call us</span>
            <span className="mt-2 flex items-center gap-3 font-display text-3xl font-bold transition-colors group-hover:text-sky sm:text-4xl">
              <Phone className="h-7 w-7" aria-hidden="true" /> {company.phone}
            </span>
          </a>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button to="/request-a-quote" variant="accent" size="lg">
              Request a quote
            </Button>
            <Button href={company.phoneHref} variant="outline-light" size="lg" icon={Phone}>
              Call us
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
