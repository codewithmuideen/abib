import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Mail, MapPin, Menu, Phone, Users, X } from 'lucide-react'
import { company, maps } from '../../shared/company'
import { EASE } from '../lib/motion'
import Logo from './Logo'
import { navLinks } from '../data/navigation'

const isActive = (link, { pathname, hash }) => {
  const [path, linkHash] = link.to.split('#')
  if (linkHash) return pathname === path && hash === `#${linkHash}`
  if (path === '/') return pathname === '/'
  return pathname.startsWith(path)
}

const contactItems = [
  { icon: Mail, label: 'Email us', value: company.email, href: `mailto:${company.email}` },
  { icon: Phone, label: 'Call us', value: company.phone, href: company.phoneHref },
  { icon: MapPin, label: 'Our location', value: 'Jhumat House, Barking IG11 8BB', href: maps.search, external: true },
  { icon: Users, label: 'HR enquiries', value: company.hrEmail, href: `mailto:${company.hrEmail}`, wide: true },
]

export default function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)
  const panelRef = useRef(null)
  const headerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the route changes (including back/forward).
  const [routeKey, setRouteKey] = useState(location.key)
  if (routeKey !== location.key) {
    setRouteKey(location.key)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector('a')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'Tab' && headerRef.current) {
        // Keep focus inside the header (menu bar + open panel) while the menu is open.
        const items = [...headerRef.current.querySelectorAll('a, button')].filter((el) => el.getClientRects().length)
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    const toggle = toggleRef.current
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
      toggle?.focus()
    }
  }, [open])

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-shadow duration-500 print:hidden ${
        scrolled ? 'shadow-[0_14px_40px_-20px_rgb(14_38_70/0.55)]' : ''
      }`}
    >
      <a
        href="#main"
        className="absolute left-4 top-2 z-[60] -translate-y-24 rounded bg-sky px-4 py-2 font-semibold text-navy focus:translate-y-0"
      >
        Skip to content
      </a>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 flex flex-col overflow-y-auto bg-navy pt-[var(--nav-h)] text-white lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <motion.ul
              className="container mt-6 flex-1 space-y-1"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
            >
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.to}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
                  }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(link, location) ? 'page' : undefined}
                    className="group flex items-baseline gap-4 border-b border-white/10 py-4 font-display text-3xl font-bold tracking-tight sm:text-4xl"
                  >
                    <span className="text-xs font-semibold text-sky">0{i + 1}</span>
                    <span className="transition-transform duration-500 ease-premium group-hover:translate-x-2">
                      {link.label}
                    </span>
                    <ArrowUpRight
                      className="ml-auto h-6 w-6 self-center text-white/30 transition-colors group-hover:text-sky"
                      aria-hidden="true"
                    />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div
              className="container space-y-5 pb-10 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.55 } }}
            >
              <a href={company.phoneHref} className="flex items-center gap-3 font-display text-xl font-bold">
                <Phone className="h-5 w-5 text-sky" aria-hidden="true" /> {company.phone}
              </a>
              <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-white/75">
                <Mail className="h-5 w-5 text-sky" aria-hidden="true" /> {company.email}
              </a>
              <Link
                to="/request-a-quote"
                onClick={() => setOpen(false)}
                className="flex h-14 w-full items-center justify-center gap-3 bg-sky font-display text-sm font-bold uppercase tracking-[0.14em] text-navy"
              >
                Request a quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex">
        {/* Logo block */}
        <div className="flex shrink-0 items-center justify-center bg-navy px-4 sm:px-6 lg:w-[230px] xl:w-[290px]">
          <Logo
            tone="white"
            className={`w-auto transition-[height] duration-500 ease-premium ${scrolled ? 'h-8 lg:h-9' : 'h-8 sm:h-9 lg:h-12'}`}
          />
        </div>

        <div className="min-w-0 flex-1">
          {/* Contact row (desktop) */}
          <div
            className={`hidden overflow-hidden bg-paper transition-[max-height,opacity] duration-500 ease-premium lg:block ${
              scrolled ? 'max-h-0 opacity-0' : 'max-h-[76px] opacity-100'
            }`}
          >
            <ul className="flex h-[76px] items-center justify-between gap-6 border-b border-line px-6 xl:px-10">
              {contactItems.map(({ icon: Icon, label, value, href, external, wide }) => (
                <li key={label} className={wide ? 'hidden xl:block' : ''}>
                  <a
                    href={href}
                    className="group flex items-center gap-3"
                    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-sky/70 text-royal transition-colors duration-300 group-hover:border-royal group-hover:bg-royal group-hover:text-white">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="leading-tight">
                      <span className="block text-[0.7rem] font-medium text-muted">{label}</span>
                      <span className="block whitespace-nowrap text-[0.85rem] font-semibold text-navy transition-colors group-hover:text-royal">
                        {value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu bar */}
          <nav aria-label="Main" className="flex h-[72px] items-stretch bg-paper lg:h-[54px] lg:bg-royal">
            <ul className="hidden items-stretch lg:flex">
              {navLinks.map((link) => {
                const active = isActive(link, location)
                return (
                  <li key={link.to} className="flex">
                    <Link
                      to={link.to}
                      aria-current={active ? 'page' : undefined}
                      className={`relative flex items-center px-3.5 font-display text-[0.74rem] font-bold uppercase tracking-[0.1em] transition-colors duration-300 xl:px-5 xl:text-[0.78rem] ${
                        active ? 'text-navy' : 'text-white hover:bg-white/10'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 bg-sky"
                          transition={{ duration: 0.45, ease: EASE }}
                        />
                      )}
                      <span className="relative">{link.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="ml-auto flex items-stretch">
              <a
                href={company.phoneHref}
                aria-label={`Call us on ${company.phone}`}
                className="flex items-center gap-2.5 px-3 text-navy transition-colors hover:text-royal sm:px-4 lg:text-white lg:hover:bg-white/10 lg:hover:text-white"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-royal/10 text-royal lg:h-auto lg:w-auto lg:bg-transparent lg:text-sky">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="hidden whitespace-nowrap font-display text-[0.92rem] font-bold sm:inline lg:hidden xl:inline">
                  {company.phone}
                </span>
              </a>
              <Link
                to="/request-a-quote"
                className="group hidden items-center gap-3 bg-sky px-5 font-display text-[0.74rem] font-bold uppercase tracking-[0.12em] text-navy transition-colors duration-300 hover:bg-navy hover:text-white md:flex xl:px-7"
              >
                Request a quote
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-500 ease-premium group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="grid w-[72px] place-items-center bg-royal text-white transition-colors hover:bg-navy lg:hidden"
              >
                {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
