// Personal invitation links for the First Week Review form.
// A token is base64url(JSON payload) + "." + HMAC-SHA256 signature, signed with
// REVIEW_LINK_SECRET, so links cannot be forged or edited and need no database.
import crypto from 'node:crypto'

const MAX_DAYS = 90

const b64 = (buf) => Buffer.from(buf).toString('base64url')

export const isInviteConfigured = () => (process.env.REVIEW_LINK_SECRET ?? '').length >= 32

const sign = (data) => crypto.createHmac('sha256', process.env.REVIEW_LINK_SECRET).update(data).digest('base64url')

export function createInvite({ employeeName, days = 14 }) {
  const name = String(employeeName ?? '')
    .trim()
    .slice(0, 120)
  const validDays = Math.min(Math.max(Number(days) || 14, 1), MAX_DAYS)
  const payload = {
    v: 1,
    id: crypto.randomBytes(6).toString('hex'),
    n: name,
    exp: Date.now() + validDays * 24 * 60 * 60 * 1000,
  }
  const data = b64(JSON.stringify(payload))
  return {
    token: `${data}.${sign(data)}`,
    id: payload.id,
    employeeName: name,
    expiresAt: new Date(payload.exp).toISOString(),
  }
}

/** Returns the invite details, or null when the token is missing, forged, edited or expired. */
export function verifyInvite(token) {
  if (!isInviteConfigured() || typeof token !== 'string' || token.length > 600) return null
  const [data, signature] = token.split('.')
  if (!data || !signature) return null

  const expected = Buffer.from(sign(data))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null

  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'))
    if (payload.v !== 1 || typeof payload.n !== 'string' || !payload.n || payload.exp < Date.now()) return null
    return { id: payload.id, employeeName: payload.n, expiresAt: new Date(payload.exp).toISOString() }
  } catch {
    return null
  }
}

export function checkAdminPassword(password) {
  const actual = process.env.ADMIN_PASSWORD ?? ''
  if (actual.length < 10 || typeof password !== 'string') return false
  const a = crypto.createHash('sha256').update(actual).digest()
  const b = crypto.createHash('sha256').update(password).digest()
  return crypto.timingSafeEqual(a, b)
}
