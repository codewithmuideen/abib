import { motion } from 'framer-motion'
import { EASE } from '../lib/motion'

/** Image that wipes into view and settles from a slight zoom. */
export default function ClipImage({ src, alt, className = '', imgClassName = '', from = 'bottom', delay = 0 }) {
  const hidden = { bottom: 'inset(100% 0 0 0)', left: 'inset(0 100% 0 0)', right: 'inset(0 0 0 100%)' }[from]
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: hidden }}
      whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.3, ease: EASE, delay }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover ${imgClassName}`}
        initial={{ scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: EASE, delay }}
      />
    </motion.div>
  )
}
