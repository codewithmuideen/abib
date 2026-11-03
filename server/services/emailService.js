import { Resend } from 'resend'

export class EmailNotConfiguredError extends Error {}
export class EmailDeliveryError extends Error {}

let client = null

function getClient() {
  if (!process.env.RESEND_API_KEY) return null
  client ??= new Resend(process.env.RESEND_API_KEY)
  return client
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL)
}

/**
 * Sends a transactional email through Resend.
 * Throws EmailNotConfiguredError when credentials are missing and
 * EmailDeliveryError when Resend rejects or fails the request.
 */
export async function sendEmail({ to, subject, html, text, replyTo, attachments }) {
  const resend = getClient()
  const from = process.env.RESEND_FROM_EMAIL

  if (!resend || !from) {
    throw new EmailNotConfiguredError('RESEND_API_KEY and RESEND_FROM_EMAIL must be set.')
  }

  let response
  try {
    response = await resend.emails.send({
      from,
      to: [to],
      subject: subject.replace(/[\r\n]+/g, ' ').slice(0, 250),
      html,
      text,
      ...(replyTo && { replyTo }),
      ...(attachments?.length && { attachments }),
    })
  } catch (error) {
    throw new EmailDeliveryError(error?.message || 'Resend request failed.')
  }

  if (response?.error) {
    throw new EmailDeliveryError(response.error.message || 'Resend rejected the email.')
  }

  return response.data
}
