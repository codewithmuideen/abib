import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Building2, Droplets, Phone } from 'lucide-react'
import { company } from '../../shared/company'
import { heroSlides, heroTiles } from '../data/content'
import { EASE } from '../lib/motion'

const SLIDE_MS = 6500

const appear = (delay) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: EASE, delay },
})

const LINES = [
  [{ w: 'Building' }, { w: 'Better' }, { w: 'Spaces.' }],
  [{ w: 'Delivering' }, { w: 'Reliable', accent: true }, { w: 'Solutions.', accent: true }],
]

function Headline() {
  let i = 0
  return (
    <h1
      aria-label="Building Better Spaces. Delivering Reliable Solutions."
      className="mt-6 font-display text-[2.4rem] font-extrabold uppercase leading-[1.04] tracking-[-0.02em] [text-shadow:0_2px_30px_rgb(9_26_49/0.35)] min-[400px]:text-[2.7rem] sm:text-6xl lg:text-[4.3rem] xl:text-[4.9rem]"
    >
      {LINES.map((line, l) => (
        <span key={l} aria-hidden="true" className="block">
          {line.map(({ w, accent }) => (
            <span key={w} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span
                className={`inline-block ${accent ? 'text-sky' : ''}`}
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, ease: EASE, delay: 0.3 + i++ * 0.07 }}
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
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])

  useEffect(() => {
    if (reduce || paused) return
    const id = setTimeout(() => setIndex((i) => (i + 1) % heroSlides.length), SLIDE_MS)
    return () => clearTimeout(id)
  }, [index, reduce, paused])

  const slide = heroSlides[index]

  return (
    <>
      <section
        ref={ref}
        className="relative isolate flex min-h-[660px] items-center overflow-hidden bg-navy text-white sm:min-h-[720px] lg:min-h-[100svh]"
        aria-label="Introduction"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Cross-fading photography with a slow zoom */}
        <motion.div className="absolute inset-0 -z-20" style={{ y: imageY }}>
          <AnimatePresence initial={false}>
            <motion.img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              fetchPriority={index === 0 ? 'high' : undefined}
              className="absolute inset-0 h-[116%] w-full object-cover"
              style={{ objectPosition: slide.position ?? 'center' }}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{
                opacity: 1,
                scale: 1.02,
                transition: { opacity: { duration: 1.4 }, scale: { duration: 8, ease: 'linear' } },
              }}
              exit={{ opacity: 0, transition: { duration: 1.4 } }}
            />
          </AnimatePresence>
        </motion.div>
        {/* Light overlay: just enough for legible text, the photo stays vivid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/80 via-navy/40 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-navy/40 to-transparent"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy/20 lg:hidden" />

        <div className="container pb-24 pt-[calc(var(--nav-h)+3rem)] lg:pb-28 lg:pt-[calc(var(--nav-h)+2rem)]">
          <div className="max-w-3xl">
            <motion.p
              className="flex items-center gap-3 font-display text-sm font-semibold text-white/95 sm:text-base"
              {...appear(0.15)}
            >
              <span className="h-[2px] w-10 bg-sky" aria-hidden="true" />
              Plumbing &amp; Building Management, London
            </motion.p>

            <Headline />

            <motion.p className="mt-7 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl" {...appear(0.9)}>
              Professional plumbing and building management solutions designed to keep properties operating safely,
              efficiently and reliably.
            </motion.p>

            <motion.div className="mt-10 flex flex-col gap-3 sm:flex-row" {...appear(1.05)}>
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

            <motion.a href={company.phoneHref} className="group mt-10 inline-flex items-center gap-4" {...appear(1.2)}>
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

        {/* Slide controls */}
        <div className="absolute inset-x-0 bottom-8 flex justify-center gap-2.5">
          {heroSlides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1} of ${heroSlides.length}`}
              aria-current={i === index ? 'true' : undefined}
              className={`h-2.5 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-sky' : 'w-2.5 bg-white/60 hover:bg-white'}`}
            />
          ))}
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
