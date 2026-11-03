import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Building2, Droplets, Phone } from 'lucide-react'
import { company } from '../../shared/company'
import { heroImage, heroTiles } from '../data/content'
import { EASE } from '../lib/motion'

const appear = (delay) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: EASE, delay },
})

const LINES = [
  [{ w: 'Building' }, { w: 'Better' }, { w: 'Spaces.' }],
  [{ w: 'Delivering' }],
  [
    { w: 'Reliable', accent: true },
    { w: 'Solutions.', accent: true },
  ],
]

// Word order across all lines, used to stagger the reveal.
const WORDS = LINES.flatMap((line, l) => line.map((word, w) => ({ ...word, key: `${l}-${w}` })))
const delayOf = (key) => 0.3 + WORDS.findIndex((w) => w.key === key) * 0.07

function Headline() {
  return (
    <h1
      aria-label="Building Better Spaces. Delivering Reliable Solutions."
      className="mt-6 font-display text-[2.3rem] font-extrabold uppercase leading-[1.04] tracking-[-0.02em] min-[400px]:text-[2.6rem] sm:text-[3.4rem] lg:text-[3.6rem] xl:text-[4rem]"
    >
      {LINES.map((line, l) => (
        <span key={l} aria-hidden="true" className="block">
          {line.map(({ w, accent }, i) => (
            <span key={w} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span
                className={`inline-block ${accent ? 'text-sky' : ''}`}
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, ease: EASE, delay: delayOf(`${l}-${i}`) }}
              >
                {w}&nbsp;
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </h1>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])

  return (
    <>
      <section
        ref={ref}
        className="relative isolate flex min-h-[660px] items-center overflow-hidden bg-navy text-white sm:min-h-[720px] lg:min-h-[100svh]"
        aria-label="Introduction"
      >
        {/* Photography with a slow settle and gentle scroll parallax */}
        <motion.div
          className="absolute inset-0 -z-20 lg:left-[26%] lg:[mask-image:linear-gradient(to_right,transparent,black_28%)]"
          style={{ y: imageY }}
        >
          <motion.img
            src={heroImage.src}
            alt={heroImage.alt}
            fetchPriority="high"
            className="absolute inset-0 h-[116%] w-full object-cover"
            style={{ objectPosition: heroImage.position }}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.4, ease: EASE }}
          />
        </motion.div>
        {/* Light overlay: just enough for legible text, the photo stays vivid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/75 via-navy/35 to-transparent lg:hidden"
        />
        {/* Desktop: the photo sits to the right and its left edge blends into navy */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-navy/70 from-[20%] via-navy/25 via-[45%] to-transparent to-[60%] lg:block"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-navy/40 to-transparent"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy/20 lg:hidden" />

        <div className="container pb-24 pt-[calc(var(--nav-h)+3rem)] lg:pb-28 lg:pt-[calc(var(--nav-h)+2rem)]">
          <div className="max-w-[960px]">
            <motion.p
              className="flex items-center gap-3 font-display text-sm font-semibold text-white/95 sm:text-base"
              {...appear(0.15)}
            >
              <span className="h-[2px] w-10 bg-sky" aria-hidden="true" />
              Plumbing &amp; Building Management, London
            </motion.p>

            <Headline />

            <motion.p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl" {...appear(0.9)}>
              Professional plumbing and building management solutions designed to keep properties operating safely,
              efficiently and reliably.
            </motion.p>

            <motion.div className="mt-9 flex flex-col gap-3 sm:flex-row" {...appear(1.05)}>
              <Link
                to="/request-a-quote"
                className="group inline-flex h-14 items-center justify-center gap-3 whitespace-nowrap bg-sky px-8 font-display text-[0.8rem] font-bold uppercase tracking-[0.14em] text-navy transition-colors duration-300 hover:bg-white"
              >
                Request a quote
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-500 ease-premium group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <Link
                to="/services"
                className="inline-flex h-14 items-center justify-center whitespace-nowrap bg-royal px-8 font-display text-[0.8rem] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-navy"
              >
                Explore our services
              </Link>
            </motion.div>

            <motion.a href={company.phoneHref} className="group mt-9 inline-flex items-center gap-4" {...appear(1.2)}>
              <span className="relative grid h-12 w-12 place-items-center rounded-full bg-white/15 backdrop-blur">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 animate-ping rounded-full bg-sky/40 [animation-duration:2.6s]"
                />
                <Phone className="relative h-5 w-5" aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                  Speak to our team
                </span>
                <span className="block font-display text-xl font-bold transition-colors group-hover:text-sky">
                  {company.phone}
                </span>
              </span>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Colour tile and photo band */}
      <section aria-label="What we do" className="grid sm:grid-cols-2 lg:grid-cols-4">
        {heroTiles.map((tile, i) => {
          if (tile.image) {
            return (
              <motion.div
                key={tile.image.src}
                className="group relative aspect-[4/3] overflow-hidden sm:aspect-auto sm:min-h-[300px]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1 }}
              >
                <img
                  src={tile.image.src}
                  alt={tile.image.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] ease-premium group-hover:scale-[1.06]"
                  style={{ objectPosition: tile.image.position ?? 'center' }}
                />
              </motion.div>
            )
          }
          const Icon = tile.icon === 'droplets' ? Droplets : Building2
          const dark = tile.tone === 'royal'
          return (
            <motion.div
              key={tile.title}
              className={`flex flex-col items-center justify-center px-8 py-12 text-center sm:min-h-[300px] ${
                dark ? 'bg-royal text-white' : 'bg-sky text-navy'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.1 }}
            >
              <Icon className="h-14 w-14" strokeWidth={1.3} aria-hidden="true" />
              <h2 className="mt-6 font-display text-lg font-bold uppercase tracking-wide">{tile.title}</h2>
              <p className={`mt-3 max-w-xs text-sm leading-relaxed ${dark ? 'text-white/85' : 'text-navy/85'}`}>
                {tile.text}
              </p>
              <Link
                to={tile.to}
                className={`mt-5 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.14em] ${
                  dark ? 'text-white hover:text-sky' : 'text-navy hover:text-white'
                }`}
              >
                Learn more <span className="sr-only">about {tile.title}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </motion.div>
          )
        })}
      </section>
    </>
  )
}
