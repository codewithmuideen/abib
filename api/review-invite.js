// Vercel serverless function: checks a personal First Week Review link.
import { handleReviewInvite } from '../server/routes/reviewInvites.js'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ message: 'Method not allowed.' })
  }
  return handleReviewInvite(req, res)
}
