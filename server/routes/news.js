// Industry headlines for the blog, gathered from Google News RSS searches that
// match Abib's services. Results are cached in memory so the feeds are only
// contacted every CACHE_MS, and the last good result is served if a refresh fails.

const CACHE_MS = 30 * 60 * 1000
const PER_TOPIC = 12

export const NEWS_TOPICS = [
  { key: 'plumbing', label: 'Plumbing', query: '(plumbing OR plumber OR plumbers) UK' },
  { key: 'maintenance', label: 'Building Maintenance', query: '"building maintenance" OR "facilities management" UK' },
  {
    key: 'property',
    label: 'Property',
    query: '"property maintenance" OR landlords repairs OR "social housing" repairs UK',
  },
  {
    key: 'safety',
    label: 'Building Safety',
    query: '"building safety" OR "building regulations" OR "Building Safety Regulator" UK',
  },
]

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

const decode = (s = '') =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
    .trim()

const tag = (xml, name) => xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1] ?? ''

function parseFeed(xml, topic) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .map(([, item]) => {
      const source = decode(tag(item, 'source'))
      let title = decode(tag(item, 'title'))
      // Google News appends " - Publisher" to every title.
      if (source && title.endsWith(` - ${source}`)) title = title.slice(0, -(source.length + 3))
      const link = decode(tag(item, 'link'))
      const published = new Date(decode(tag(item, 'pubDate')))
      return {
        id: decode(tag(item, 'guid')) || link,
        title,
        link,
        source: source || 'News',
        publishedAt: Number.isNaN(published.getTime()) ? null : published.toISOString(),
        topic: topic.key,
      }
    })
    .filter((n) => n.title && /^https:\/\//.test(n.link))
}

async function fetchTopic(topic) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(`${topic.query} when:30d`)}&hl=en-GB&gl=GB&ceid=GB:en`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AbibWebsite/1.0; +https://www.abibltd.co.uk)' },
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new Error(`Feed ${topic.key} returned ${res.status}`)
  return parseFeed(await res.text(), topic).slice(0, PER_TOPIC)
}

let cache = null

async function loadNews() {
  if (cache && Date.now() - cache.time < CACHE_MS) return cache.data

  const results = await Promise.allSettled(NEWS_TOPICS.map(fetchTopic))
  const seen = new Set()
  const items = results
    .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
    .filter((n) => {
      const key = n.title.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))

  if (!items.length) {
    if (cache) return cache.data
    throw new Error(
      results
        .map((r) => r.reason?.message)
        .filter(Boolean)
        .join('; ') || 'No headlines returned',
    )
  }

  const data = {
    updatedAt: new Date().toISOString(),
    topics: NEWS_TOPICS.map(({ key, label }) => ({ key, label })),
    items,
  }
  cache = { time: Date.now(), data }
  return data
}

export async function handleNews(req, res) {
  try {
    const data = await loadNews()
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=1800, stale-while-revalidate=3600')
    return res.status(200).json(data)
  } catch (error) {
    console.error('[news] Could not load headlines:', error.message)
    return res.status(502).json({ message: 'Headlines are temporarily unavailable. Please try again shortly.' })
  }
}
