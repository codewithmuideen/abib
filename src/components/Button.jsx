import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const VARIANTS = {
  // Royal on light backgrounds, fills navy on hover.
  primary: 'bg-royal text-white hover:text-white [--fill:rgb(var(--c-navy))]',
  // Sky on dark backgrounds, fills white on hover.
  accent: 'bg-sky text-navy hover:text-navy [--fill:rgb(var(--c-paper))]',
  dark: 'bg-navy text-white hover:text-white [--fill:rgb(var(--c-royal))]',
  outline: 'border border-navy/20 text-navy hover:text-white [--fill:rgb(var(--c-navy))]',
  'outline-light': 'border border-white/30 text-white hover:text-navy [--fill:rgb(var(--c-paper))]',
}

const SIZES = {
  md: 'h-12 px-6 text-[0.78rem]',
  lg: 'h-14 px-8 text-[0.8rem]',
}

/**
 * Brand button with a rolling label and sweep-fill hover.
 * Renders a router Link (to), an anchor (href) or a native button.
 */
export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon = ArrowUpRight,
  className = '',
  children,
  ...props
}) {
  const classes = `group relative isolate inline-flex select-none items-center whitespace-nowrap justify-center gap-3 overflow-hidden rounded-xl font-display font-bold uppercase tracking-[0.14em] transition-[color,opacity] duration-500 ease-premium disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`

  const content = (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-[var(--fill)] transition-transform duration-500 ease-premium group-hover:scale-y-100 group-disabled:scale-y-0"
      />
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-premium group-hover:-translate-y-full group-disabled:translate-y-0">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-premium group-hover:translate-y-0 group-disabled:translate-y-full"
        >
          {children}
        </span>
      </span>
      {Icon && (
        <Icon
          aria-hidden="true"
          className="h-4 w-4 shrink-0 transition-transform duration-500 ease-premium group-hover:rotate-45"
          strokeWidth={2.25}
        />
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  )
}
