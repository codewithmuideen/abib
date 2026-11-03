// Vercel serverless function: reuses the Express route handler.
import { handleNews } from '../server/routes/news.js'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ message: 'Method not allowed.' })
  }
  return handleNews(req, res)
}
