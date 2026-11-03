// Vercel serverless function: reuses the Express route handler.
import { handleContactForm } from '../server/routes/contact.js'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Method not allowed.' })
  }
  return handleContactForm(req, res)
}
