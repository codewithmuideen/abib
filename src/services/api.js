export class ApiError extends Error {
  constructor(message, { status = 0, fieldErrors } = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

async function request(path, init) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 45_000)

  let response
  try {
    response = await fetch(path, { ...init, signal: controller.signal, headers: { Accept: 'application/json', ...init.headers } })
  } catch {
    throw new ApiError('We could not reach our server. Please check your connection and try again.')
  } finally {
    clearTimeout(timeout)
  }

  let data = {}
  try {
    data = await response.json()
  } catch {
    // Non-JSON response (e.g. proxy error page): fall through to the status check.
  }

  if (!response.ok) {
    throw new ApiError(data.message || `Your submission could not be sent (error ${response.status}).`, {
      status: response.status,
      fieldErrors: data.errors,
    })
  }
  return data
}

const postJson = (path, body) =>
  request(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

export const submitContact = (values) => postJson('/api/contact', values)
export const submitQuote = (values) => postJson('/api/quote', values)
export const submitFirstWeekReview = (values) => postJson('/api/first-week-review', values)
export const fetchReviewInvite = (token) =>
  request(`/api/review-invite?token=${encodeURIComponent(token)}`, { method: 'GET' })
export const createReviewLink = (values) => postJson('/api/review-links', values)

export const fetchNews = () => request('/api/news', { method: 'GET' })
