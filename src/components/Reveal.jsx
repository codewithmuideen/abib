import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../lib/motion'

/** Fades and lifts its content into view once, when scrolled to. */
export function Reveal({ as = 'div', delay = 0, variants = fadeUp, className, children, ...props }) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      transition={delay ? { delay } : undefined}
      {...props}
    >
      {children}
    </Component>
  )
}

/** Staggers the reveal of direct RevealItem children. */
export function RevealGroup({ as = 'div', gap = 0.08, delay = 0, className, children, ...props }) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      variants={stagger(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      {...props}
    >
      {children}
    </Component>
  )
}

export function RevealItem({ as = 'div', variants = fadeUp, className, children, ...props }) {
  const Component = motion[as]
  return (
    <Component className={className} variants={variants} {...props}>
      {children}
    </Component>
  )
}
