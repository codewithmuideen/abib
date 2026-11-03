import { HONEYPOT_FIELD } from '../../shared/schemas.js'
import { EmailDeliveryError, EmailNotConfiguredError, sendEmail } from '../services/emailService.js'

const fieldErrors = (error) => {
  const errors = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.')
    if (key && !errors[key]) errors[key] = issue.message
  }
  return errors
}

/**
 * Creates an Express handler that validates a submission against a shared
 * schema, builds an email from the validated data and sends it via Resend.
 * The visitor only sees success once Resend has accepted the email.
 */
export function formHandler({ name, schema, buildEmail, successMessage }) {
  const handler = async (req, res) => {
    const body = req.body ?? {}

    if (typeof body[HONEYPOT_FIELD] === 'string' && body[HONEYPOT_FIELD].trim() !== '') {
      return res.status(400).json({ message: 'Your submission could not be processed.' })
    }

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return res.status(422).json({
        message: 'Some fields need attention. Please check the form and try again.',
        errors: fieldErrors(parsed.error),
      })
    }

    try {
      const email = await buildEmail(parsed.data, req)
      await sendEmail(email)
      return res.status(200).json({ message: successMessage })
    } catch (error) {
      if (error instanceof EmailNotConfiguredError) {
        console.error(`[${name}] Email is not configured: ${error.message}`)
        return res.status(503).json({
          message: 'Our online form is temporarily unavailable. Please email or call us directly.',
        })
      }
      if (error instanceof EmailDeliveryError) {
        console.error(`[${name}] Resend delivery failed: ${error.message}`)
        return res.status(502).json({
          message: 'We could not send your submission just now. Please try again shortly or contact us directly.',
        })
      }
      if (error?.status && error.status < 500) {
        return res.status(error.status).json({ message: error.message, errors: error.errors })
      }
      console.error(`[${name}] Unexpected error`, error)
      return res.status(500).json({ message: 'Something went wrong. Please try again or contact us directly.' })
    }
  }
  // Exposed for testing the generated emails.
  handler.schema = schema
  handler.buildEmail = buildEmail
  return handler
}
