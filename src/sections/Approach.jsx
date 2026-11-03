import { motion } from 'framer-motion'
import { ClipboardCheck, MessageSquare, Search, Wrench } from 'lucide-react'
import { approach } from '../data/content'
import { EASE, viewport } from '../lib/motion'
import { Reveal } from '../components/Reveal'

const ICONS = [Search, ClipboardCheck, Wrench, MessageSquare]

// Gradient pairs for each card border, drawn from the logo palette.
const GRADIENTS = [
  ['#0E2646', '#1766C1'],
  ['#1766C1', '#229BD8'],
  ['#229BD8', '#1766C1'],
  ['#1766C1', '#0E2646'],
]

function Dot({ color, className, delay }) {
  return (
    <motion.span
      aria-hidden="true"
      className={`absolute z-10 h-[18px] w-[18px] rounded-full ring-4 ring-paper ${className}`}
      style={{ backgroundColor: color }}
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={viewport}
      transition={{ type: 'spring', stiffness: 300, damping: 18, delay }}
    />
  )
}

function Connector({ from, to, delay, id }) {
  const draw = {
    initial: { pathLength: 0 },
    whileInView: { pathLength: 1 },
    viewport,
    transition: { duration: 0.9, ease: EASE, delay },
  }
  return (
    <>
      {/* Desktop: stepped run from the top-right of one card to the bottom-left of the next */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute left-full top-0 hidden h-full w-16 overflow-visible lg:block xl:w-20"
      >
        <defs>
          <linearGradient id={`${id}-h`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        </defs>
        <motion.path
          d="M0 22 H22 L78 78 H100"
          fill="none"
          stroke={`url(#${id}-h)`}
          strokeWidth="3"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          {...draw}
        />
      </svg>
      {/* Mobile and tablet: vertical run between stacked cards */}
      <svg
        aria-hidden="true"
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
        className="absolute left-1/2 top-full h-14 w-[2.5px] -translate-x-1/2 lg:hidden"
      >
        <defs>
          <linearGradient id={`${id}-v`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        </defs>
        <motion.path
          d="M1 0 V100"
          fill="none"
          stroke={`url(#${id}-v)`}
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
          {...draw}
        />
      </svg>
    </>
  )
}

export default function Approach({ id = 'approach', heading = true }) {
  return (
    <section id={id} className="section relative overflow-hidden bg-mist" aria-labelledby={`${id}-heading`}>
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-50 [background-image:radial-gradient(rgb(14_38_70/0.08)_1px,transparent_1px)] [background-size:22px_22px]"
      />
      <div className="container relative">
        {heading && (
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="eyebrow justify-center">Our Approach</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id={`${id}-heading`} className="heading-lg mt-5 uppercase text-navy">
                A clear process, from start to finish
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 text-lg leading-relaxed text-muted">
                Every project follows the same four steps, so you always know what to expect and who to speak to.
              </p>
            </Reveal>
          </div>
        )}
        {!heading && (
          <h2 id={`${id}-heading`} className="sr-only">
            Our four-step approach
          </h2>
        )}

        <ol className="mx-auto mt-16 grid max-w-md gap-14 lg:mt-20 lg:max-w-none lg:grid-cols-4 lg:gap-16 xl:gap-20">
          {approach.map((step, i) => {
            const Icon = ICONS[i]
            const [c1, c2] = GRADIENTS[i]
            const next = GRADIENTS[i + 1]
            const titleColor = i % 2 === 0 ? 'text-royal' : 'text-navy'
            return (
              <motion.li
                key={step.number}
                className="relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: 0.9, ease: EASE, delay: i * 0.18 }}
              >
                <div
                  className="group relative h-full rounded-[30px] p-[2.5px] shadow-[0_30px_60px_-35px_rgb(14_38_70/0.45)] transition-transform duration-500 ease-premium hover:-translate-y-1.5"
                  style={{ backgroundImage: `linear-gradient(160deg, ${c1}, ${c2})` }}
                >
                  <div className="flex h-full flex-col items-center rounded-[28px] bg-paper px-7 pb-9 pt-10 text-center">
                    <span
                      className="grid h-16 w-16 place-items-center rounded-2xl text-white shadow-lg transition-transform duration-500 ease-premium group-hover:scale-110"
                      style={{ backgroundImage: `linear-gradient(135deg, ${c1}, ${c2})` }}
                    >
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <p className="mt-6 font-display text-xs font-bold uppercase tracking-[0.22em] text-muted">
                      Step {step.number}
                    </p>
                    <h3 className={`mt-2 font-display text-2xl font-extrabold uppercase tracking-tight ${titleColor}`}>
                      {step.title}
                    </h3>
                    <p className="mt-4 leading-relaxed text-muted">{step.text}</p>
                  </div>

                  {i > 0 && (
                    <Dot
                      color={c1}
                      delay={i * 0.18 + 0.5}
                      className="left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 lg:left-0 lg:top-[78%]"
                    />
                  )}
                  {next && (
                    <>
                      <Dot
                        color={c2}
                        delay={i * 0.18 + 0.4}
                        className="bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 lg:bottom-auto lg:left-auto lg:right-0 lg:top-[22%] lg:-translate-y-1/2 lg:translate-x-1/2"
                      />
                      <Connector id={`${id}-c${i}`} from={c2} to={next[0]} delay={i * 0.18 + 0.45} />
                    </>
                  )}
                </div>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
