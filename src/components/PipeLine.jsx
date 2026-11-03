import { motion } from 'framer-motion'
import { EASE } from '../lib/motion'

/** Decorative pipe run drawn from the geometry of the Abib "B": a bend with a valve cap. */
export default function PipeLine({ className = '', delay = 0.4, inView = false }) {
  const trigger = inView
    ? { initial: 'hidden', whileInView: 'show', viewport: { once: true } }
    : { initial: 'hidden', animate: 'show' }
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    show: { pathLength: 1, opacity: 1, transition: { duration: 2.2, ease: EASE, delay } },
  }

  return (
    <motion.svg viewBox="0 0 320 420" fill="none" aria-hidden="true" className={className} {...trigger}>
      <motion.path
        d="M40 420 V170 a110 110 0 0 1 110 -110 H190 a70 70 0 0 1 0 140 H150 a80 80 0 0 1 0 -160"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        variants={draw}
      />
      <motion.rect
        x="22"
        y="402"
        width="36"
        height="10"
        rx="3"
        fill="currentColor"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: delay + 0.2 } } }}
      />
    </motion.svg>
  )
}
