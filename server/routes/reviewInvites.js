import { checkAdminPassword, createInvite, isInviteConfigured, verifyInvite } from '../lib/reviewInvite.js'

const notConfigured = (res) =>
  res
    .status(503)
    .json({ message: 'Review links are not set up yet. REVIEW_LINK_SECRET must be configured on the server.' })

// Small in-memory brake on password guessing (per server instance).
const attempts = new Map()
const tooManyAttempts = (ip) => {
  const now = Date.now()
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < 15 * 60 * 1000)
  attempts.set(ip, recent)
  return recent.length >= 10
}

/** GET /api/review-invite?token=… : checks a personal link before the form is shown. */
export function handleReviewInvite(req, res) {
  if (!isInviteConfigured()) return notConfigured(res)
  const invite = verifyInvite(req.query?.token)
  res.setHeader('Cache-Control', 'no-store')
  if (!invite) return res.status(403).json({ message: 'This review link is invalid or has expired.' })
  return res.status(200).json(invite)
}

/** POST /api/review-links { password, employeeName, days } : creates a personal link (admin only). */
export function handleCreateReviewLink(req, res) {
  if (!isInviteConfigured()) return notConfigured(res)
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'
  if (tooManyAttempts(ip)) return res.status(429).json({ message: 'Too many attempts. Please wait 15 minutes.' })

  const { password, employeeName, days } = req.body ?? {}
  if (!checkAdminPassword(password)) {
    attempts.get(ip).push(Date.now())
    return res.status(401).json({ message: 'Incorrect admin password.' })
  }
  const name = typeof employeeName === 'string' ? employeeName.trim() : ''
  if (name.length < 2 || name.length > 120) {
    return res
      .status(422)
      .json({ message: 'Enter the employee’s full name.', errors: { employeeName: 'Enter the employee’s full name.' } })
  }

  const invite = createInvite({ employeeName: name, days })
  const proto = req.headers['x-forwarded-proto']?.split(',')[0] || (req.secure ? 'https' : 'http')
  const origin = process.env.SITE_URL || `${proto}://${req.headers['x-forwarded-host'] || req.headers.host}`
  res.setHeader('Cache-Control', 'no-store')
  return res.status(200).json({ ...invite, url: `${origin.replace(/\/$/, '')}/review/${invite.token}` })
}
