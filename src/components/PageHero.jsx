import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { EASE } from '../lib/motion'
import SplitText from './SplitText'

/** Full-width photographic header for inner pages, with a light overlay so the image stays vivid. */
export default function PageHero({ eyebrow, title, intro, image, crumb, children }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[460px] items-end overflow-hidden bg-navy text-white sm:min-h-[520px] lg:min-h-[600px]"
    >
      {image && (
        <motion.div className="absolute inset-0 -z-20" style={{ y }}>
          <motion.img
            src={image.src}
            alt=""
            fetchPriority="high"
            className="h-[118%] w-full object-cover"
            style={{ objectPosition: image.position ?? 'center' }}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: EASE }}
          />
        </motion.div>
      )}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/80 via-navy/45 to-navy/5" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-navy/50 to-transparent"
      />

      <div className="container w-full pb-14 pt-[calc(var(--nav-h)+3.5rem)] sm:pb-16 lg:pb-20">
        <motion.nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-sm text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Link to="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span aria-current="page" className="font-semibold text-sky">
            {crumb}
          </span>
        </motion.nav>

        <motion.p
          className="flex items-center gap-3 font-display text-sm font-semibold text-white/95 sm:text-base"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        >
          <span className="h-[2px] w-10 bg-sky" aria-hidden="true" />
          {eyebrow}
        </motion.p>
        <SplitText
          lines={title}
          className="mt-5 max-w-4xl font-display text-[2.3rem] font-extrabold uppercase leading-[1.05] tracking-[-0.02em] min-[400px]:text-[2.6rem] sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
          delay={0.15}
        />
        {intro && (
          <motion.p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
          >
            {intro}
          </motion.p>
        )}
        {children && (
          <motion.div
            className="mt-9"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.65 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  )
}
