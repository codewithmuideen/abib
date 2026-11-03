import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Clock, Newspaper, Phone, RefreshCw, Search, X } from 'lucide-react'
import { company } from '../../shared/company'
import { images } from '../data/content'
import { EASE } from '../lib/motion'
import { fetchNews } from '../services/api'
import PageHero from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import Seo from '../components/Seo'

const PAGE = 9

const photo = (name) => `/images/photos/${name}.webp`
const TOPIC_IMAGES = {
  plumbing: ['plumbing-pipework', 'tap-repair', 'kitchen-tap', 'bathroom-installation'],
  maintenance: ['building-site', 'site-team', 'builder-frame', 'hero-tradesman'],
  property: ['property-interior', 'bright-kitchen', 'bright-bathroom', 'residential-block'],
  safety: ['planning-drawings', 'plans-toolbox', 'modern-building', 'worker-portrait'],
}

// Cycle through each topic's photos in order, so neighbouring cards differ.
function assignImages(items) {
  const counters = {}
  return Object.fromEntries(
    items.map((item) => {
      const pool = TOPIC_IMAGES[item.topic] ?? TOPIC_IMAGES.maintenance
      const n = counters[item.topic] ?? 0
      counters[item.topic] = n + 1
      return [item.id, photo(pool[n % pool.length])]
    }),
  )
}

const rtf = new Intl.RelativeTimeFormat('en-GB', { numeric: 'auto' })
const timeAgo = (iso) => {
  if (!iso) return ''
  const mins = Math.round((new Date(iso).getTime() - Date.now()) / 60000)
  if (Math.abs(mins) < 60) return rtf.format(mins, 'minute')
  const hours = Math.round(mins / 60)
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour')
  const days = Math.round(hours / 24)
  if (Math.abs(days) < 7) return rtf.format(days, 'day')
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function useStructuredData(items) {
  useEffect(() => {
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = 'blog-jsonld'
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Plumbing & Building Industry News',
      url: `${company.url}/blog`,
      description: 'The latest UK plumbing, building maintenance, property and building safety news.',
      publisher: { '@type': 'Organization', name: company.name, url: company.url },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${company.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${company.url}/blog` },
        ],
      },
      ...(items.length && {
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: items
            .slice(0, 10)
            .map((n, i) => ({ '@type': 'ListItem', position: i + 1, url: n.link, name: n.title })),
        },
      }),
    })
    document.getElementById('blog-jsonld')?.remove()
    document.head.appendChild(el)
    return () => el.remove()
  }, [items])
}

function TopicBadge({ label, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-sky px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-navy ${className}`}
    >
      {label}
    </span>
  )
}

function Meta({ item, light }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm ${light ? 'text-white/80' : 'text-muted'}`}>
      <span className={`font-semibold ${light ? 'text-white' : 'text-navy'}`}>{item.source}</span>
      {item.publishedAt && (
        <>
          <span aria-hidden="true">·</span>
          <time dateTime={item.publishedAt} className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {timeAgo(item.publishedAt)}
          </time>
        </>
      )}
    </p>
  )
}

const external = { target: '_blank', rel: 'noopener noreferrer nofollow' }

function Featured({ item, topic, image }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="group relative grid overflow-hidden rounded-3xl bg-navy text-white shadow-lift lg:grid-cols-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[420px]">
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] ease-premium group-hover:scale-[1.05]"
        />
        <TopicBadge label={topic} className="absolute left-5 top-5" />
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
        <p className="mb-4 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-sky">
          <Newspaper className="h-4 w-4" aria-hidden="true" /> Featured story
        </p>
        <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-[2.1rem]">
          <a href={item.link} {...external} className="after:absolute after:inset-0">
            {item.title}
          </a>
        </h2>
        <div className="mt-5">
          <Meta item={item} light />
        </div>
        <span className="mt-8 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.14em] text-sky transition-colors group-hover:text-white">
          Read on {item.source}{' '}
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </motion.article>
  )
}

function NewsCard({ item, topic, image, index }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.6, ease: EASE, delay: (index % PAGE) * 0.05 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-paper transition-[transform,box-shadow] duration-500 ease-premium hover:-translate-y-1.5 hover:shadow-lift"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1.4s] ease-premium group-hover:scale-[1.07]"
        />
        <TopicBadge label={topic} className="absolute left-4 top-4" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Meta item={item} />
        <h3 className="mt-3 line-clamp-3 font-display text-lg font-bold leading-snug text-navy transition-colors group-hover:text-royal">
          <a href={item.link} {...external} className="after:absolute after:inset-0">
            {item.title}
          </a>
        </h3>
        <span className="mt-auto inline-flex items-center gap-2 pt-6 font-display text-xs font-bold uppercase tracking-[0.14em] text-royal">
          Read article <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-royal to-sky transition-transform duration-700 ease-premium group-hover:scale-x-100"
      />
    </motion.article>
  )
}

function PromoCard() {
  return (
    <motion.aside
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-royal to-navy p-8 text-white"
    >
      <img src="/images/logo/icon-white.png" alt="" className="absolute -right-6 -top-6 h-40 w-auto opacity-10" />
      <div>
        <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-sky">Need a hand?</p>
        <h3 className="mt-4 font-display text-2xl font-bold leading-tight">Plumbing or building work on your mind?</h3>
        <p className="mt-3 text-white/80">Talk to our team about your property and what you need.</p>
      </div>
      <div className="mt-8 space-y-3">
        <Link
          to="/request-a-quote"
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-sky font-display text-xs font-bold uppercase tracking-[0.14em] text-navy transition-colors hover:bg-white"
        >
          Request a quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <a
          href={company.phoneHref}
          className="flex items-center justify-center gap-2 font-display font-bold hover:text-sky"
        >
          <Phone className="h-4 w-4" aria-hidden="true" /> {company.phone}
        </a>
      </div>
    </motion.aside>
  )
}

function Skeleton() {
  return (
    <div aria-hidden="true">
      <div className="h-[420px] animate-pulse rounded-3xl bg-line/70" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-3xl border border-line">
            <div className="aspect-[16/10] animate-pulse bg-line/70" />
            <div className="space-y-3 p-6">
              <div className="h-3 w-1/3 animate-pulse rounded bg-line" />
              <div className="h-4 w-full animate-pulse rounded bg-line" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-line" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Blog() {
  const [state, setState] = useState({ status: 'loading', data: null, message: '' })
  const [topic, setTopic] = useState('all')
  const [query, setQuery] = useState('')
  const [visible, setVisible] = useState(PAGE)

  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: 'loading' }))
    try {
      const data = await fetchNews()
      setState({ status: 'ready', data, message: '' })
    } catch (error) {
      setState({ status: 'error', data: null, message: error.message })
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchNews()
      .then((data) => !cancelled && setState({ status: 'ready', data, message: '' }))
      .catch((error) => !cancelled && setState({ status: 'error', data: null, message: error.message }))
    return () => {
      cancelled = true
    }
  }, [])

  const topics = useMemo(() => state.data?.topics ?? [], [state.data])
  const labelFor = useCallback((key) => topics.find((t) => t.key === key)?.label ?? 'News', [topics])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (state.data?.items ?? []).filter(
      (n) =>
        (topic === 'all' || n.topic === topic) &&
        (!q || n.title.toLowerCase().includes(q) || n.source.toLowerCase().includes(q)),
    )
  }, [state.data, topic, query])

  useStructuredData(state.data?.items ?? [])

  const counts = useMemo(() => {
    const c = { all: state.data?.items.length ?? 0 }
    for (const n of state.data?.items ?? []) c[n.topic] = (c[n.topic] ?? 0) + 1
    return c
  }, [state.data])

  const imageById = useMemo(() => assignImages(filtered), [filtered])
  const [featured, ...rest] = filtered
  const shown = rest.slice(0, visible)

  const chooseTopic = (key) => {
    setTopic(key)
    setVisible(PAGE)
  }

  return (
    <>
      <Seo
        title="Blog: Plumbing & Building Industry News"
        path="/blog"
        description="The latest UK plumbing, building maintenance, property and building safety news, gathered by Abib Plumbing & Building Management Ltd."
      />
      <PageHero
        crumb="Blog"
        eyebrow="News & Insights"
        title={['Industry news,', { text: 'all in one place.', className: 'text-sky' }]}
        intro="The latest UK plumbing, building maintenance, property and building safety headlines, updated throughout the day."
        image={images.blog}
      />

      <section className="section bg-mist" aria-label="Latest headlines">
        <div className="container">
          {/* Toolbar */}
          <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div
              className="-mx-5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0"
              role="toolbar"
              aria-label="Filter by topic"
            >
              <div className="flex w-max gap-2 rounded-2xl bg-paper p-1.5 shadow-card">
                {[{ key: 'all', label: 'All news' }, ...topics].map((t) => {
                  const active = topic === t.key
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => chooseTopic(t.key)}
                      aria-pressed={active}
                      className={`relative isolate whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                        active ? 'text-white' : 'text-navy hover:bg-mist'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="topic-pill"
                          className="absolute inset-0 -z-10 rounded-xl bg-royal"
                          transition={{ duration: 0.4, ease: EASE }}
                        />
                      )}
                      {t.label}
                      {counts[t.key] > 0 && (
                        <span className={`ml-2 text-xs ${active ? 'text-white/70' : 'text-muted'}`}>
                          {counts[t.key]}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
            <label className="relative block lg:w-80">
              <span className="sr-only">Search headlines</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setVisible(PAGE)
                }}
                placeholder="Search headlines"
                className="field-control rounded-2xl pl-11 shadow-card"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-mist"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </label>
          </Reveal>

          <div className="mt-10" aria-live="polite" aria-busy={state.status === 'loading'}>
            {state.status === 'loading' && !state.data && <Skeleton />}

            {state.status === 'error' && (
              <div className="flex flex-col items-center rounded-3xl border border-line bg-paper px-6 py-16 text-center">
                <Newspaper className="h-10 w-10 text-steel" aria-hidden="true" />
                <h2 className="mt-4 font-display text-xl font-bold text-navy">Headlines are unavailable right now</h2>
                <p className="mt-2 max-w-md text-muted">{state.message}</p>
                <button
                  type="button"
                  onClick={load}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-royal px-5 py-3 text-sm font-semibold text-white hover:bg-navy"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" /> Try again
                </button>
              </div>
            )}

            {state.data && filtered.length === 0 && (
              <div className="rounded-3xl border border-dashed border-line bg-paper px-6 py-16 text-center">
                <h2 className="font-display text-xl font-bold text-navy">No headlines match your search</h2>
                <p className="mt-2 text-muted">Try another keyword or topic.</p>
              </div>
            )}

            {state.data && featured && (
              <>
                <Featured
                  key={featured.id}
                  item={featured}
                  topic={labelFor(featured.topic)}
                  image={imageById[featured.id]}
                />
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {shown.flatMap((item, i) => {
                      const card = (
                        <NewsCard
                          key={item.id}
                          item={item}
                          topic={labelFor(item.topic)}
                          image={imageById[item.id]}
                          index={i}
                        />
                      )
                      return i === 4 ? [card, <PromoCard key="promo" />] : [card]
                    })}
                  </AnimatePresence>
                </div>
                {rest.length > visible && (
                  <div className="mt-12 text-center">
                    <button
                      type="button"
                      onClick={() => setVisible((v) => v + PAGE)}
                      className="inline-flex h-14 items-center gap-3 rounded-2xl bg-navy px-8 font-display text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-royal"
                    >
                      Load more stories <ArrowRight className="h-4 w-4 rotate-90" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {state.data && (
            <p className="mx-auto mt-14 max-w-2xl text-center text-sm leading-relaxed text-muted">
              Headlines are gathered automatically from third-party publishers via Google News and link to the original
              articles. {company.name} is not responsible for external content. Last updated{' '}
              {timeAgo(state.data.updatedAt)}.
            </p>
          )}
        </div>
      </section>
    </>
  )
}
