// Vercel serverless function: reuses the Express route handler.
import { handleQuoteForm } from '../server/routes/quote.js'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Method not allowed.' })
  }
  return handleQuoteForm(req, res)
}
