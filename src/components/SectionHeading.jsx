import { Reveal } from './Reveal'

export default function SectionHeading({ eyebrow, title, intro, light = false, align = 'left', className = '' }) {
  const centered = align === 'center'
  return (
    <div className={`${centered ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      {eyebrow && (
        <Reveal>
          <p className={`eyebrow ${light ? 'eyebrow-light' : ''} ${centered ? 'justify-center' : ''}`}>{eyebrow}</p>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 className={`heading-lg mt-5 ${light ? 'text-white' : 'text-navy'}`}>{title}</h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.16}>
          <p className={`mt-6 text-lg leading-relaxed ${light ? 'text-white/70' : 'text-muted'}`}>{intro}</p>
        </Reveal>
      )}
    </div>
  )
}
