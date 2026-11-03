import { motion } from 'framer-motion'
import { EASE } from '../lib/motion'

const word = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 1, ease: EASE } },
}

/**
 * Reveals text word by word from behind a mask. Pass an array of lines to
 * control line breaks; each line may carry a className for styling.
 */
export default function SplitText({ lines, as = 'h1', className, delay = 0, inView = false, ...props }) {
  const Component = motion[as]
  const trigger = inView
    ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } }
    : { initial: 'hidden', animate: 'show' }

  const label = lines.map((line) => (typeof line === 'string' ? line : line.text)).join(' ')

  return (
    <Component
      className={className}
      aria-label={label}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
      {...trigger}
      {...props}
    >
      {lines.map((line, i) => {
        const { text, className: lineClass } = typeof line === 'string' ? { text: line } : line
        return (
          <span key={i} aria-hidden="true" className={`block ${lineClass ?? ''}`}>
            {text.split(' ').map((w, j) => (
              <span key={j} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                <motion.span className="inline-block will-change-transform" variants={word}>
                  {w}
                </motion.span>
                {j < text.split(' ').length - 1 && ' '}
              </span>
            ))}
          </span>
        )
      })}
    </Component>
  )
}
