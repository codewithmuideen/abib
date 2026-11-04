// Vercel serverless function: creates personal First Week Review links (admin password required).
import { handleCreateReviewLink } from '../server/routes/reviewInvites.js'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Method not allowed.' })
  }
  return handleCreateReviewLink(req, res)
}
