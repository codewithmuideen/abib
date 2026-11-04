import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { isEmailConfigured } from './services/emailService.js'
import { handleContactForm } from './routes/contact.js'
import { handleQuoteForm } from './routes/quote.js'
import { handleNews } from './routes/news.js'
import { handleCreateReviewLink, handleReviewInvite } from './routes/reviewInvites.js'
import { handleFirstWeekReview } from './routes/firstWeekReview.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLIENT_BUILD = path.resolve(__dirname, '../dist')
const PORT = Number(process.env.PORT || 3001)

// Client-side routes that should return 200; anything else gets the app with a 404 status.
const APP_ROUTES = new Set([
  '/',
  '/about',
  '/services',
  '/our-approach',
  '/contact',
  '/request-a-quote',
  '/blog',
  '/first-week-review',
  '/review-links',
  '/privacy-policy',
])

const app = express()
app.disable('x-powered-by')

// Set TRUST_PROXY to the number of proxies in front of the app (e.g. 1) so
// rate limiting sees the real visitor IP.
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY)

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'img-src': ["'self'", 'data:'],
        'frame-src': ['https://www.google.com', 'https://maps.google.com'],
        'connect-src': ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
)

const json = (status, message) => (req, res) => res.status(status).json({ message })

// Each form gets its own limit; only successfully sent submissions count towards it.
const formLimiter = () =>
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 6,
    skipFailedRequests: true,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: json(429, 'Too many submissions from this connection. Please wait a few minutes and try again.'),
  })

const api = express.Router()
api.use(express.json({ limit: '100kb' }))
api.get('/health', (req, res) => res.json({ ok: true, email: isEmailConfigured() ? 'configured' : 'not-configured' }))
api.post('/contact', formLimiter(), handleContactForm)
api.post('/quote', formLimiter(), handleQuoteForm)
api.get('/news', handleNews)
api.get('/review-invite', handleReviewInvite)
api.post('/review-links', handleCreateReviewLink)
api.post('/first-week-review', formLimiter(), handleFirstWeekReview)
api.use(json(404, 'Not found.'))
// eslint-disable-next-line no-unused-vars
api.use((error, req, res, next) => {
  if (error?.type === 'entity.too.large') return res.status(413).json({ message: 'Submission is too large.' })
  if (error?.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid request body.' })
  console.error('[api] Unhandled error', error)
  return res.status(500).json({ message: 'Something went wrong. Please try again.' })
})
app.use('/api', api)

// The careers page was replaced by the blog.
app.get('/careers', (req, res) => res.redirect(301, '/blog'))

if (fs.existsSync(path.join(CLIENT_BUILD, 'index.html'))) {
  app.use('/assets', express.static(path.join(CLIENT_BUILD, 'assets'), { immutable: true, maxAge: '1y' }))
  app.use(express.static(CLIENT_BUILD, { index: false, maxAge: '1d' }))
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    const route = req.path.length > 1 ? req.path.replace(/\/+$/, '') : req.path
    res.setHeader('Cache-Control', 'no-cache')
    const known = APP_ROUTES.has(route) || route.startsWith('/review/')
    res.status(known ? 200 : 404).sendFile(path.join(CLIENT_BUILD, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Abib server listening on http://localhost:${PORT}`)
  if (!isEmailConfigured()) {
    console.warn('Resend is not configured: form submissions will return 503 until RESEND_API_KEY and RESEND_FROM_EMAIL are set.')
  }
})
