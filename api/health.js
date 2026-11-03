// Vercel serverless function: reports whether email delivery is configured.
import { isEmailConfigured } from '../server/services/emailService.js'

export default function handler(req, res) {
  return res.status(200).json({ ok: true, email: isEmailConfigured() ? 'configured' : 'not-configured' })
}
