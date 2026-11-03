import { quoteSchema } from '../../shared/schemas.js'
import { renderEmail } from '../lib/emailTemplate.js'
import { formHandler } from '../lib/formHandler.js'

export const handleQuoteForm = formHandler({
  name: 'quote',
  schema: quoteSchema,
  successMessage: 'Thank you. Your quote request has been received and our team will be in touch.',
  buildEmail: (data) => ({
    to: process.env.CONTACT_EMAIL || 'info@abibltd.co.uk',
    replyTo: data.email,
    subject: `Quote request: ${data.service} from ${data.name}`,
    ...renderEmail({
      title: 'New quote request',
      intro: 'A quote request has been submitted through the website. Reply to this email to respond directly.',
      sections: [
        {
          heading: 'Contact details',
          rows: [
            ['Name', data.name],
            ['Email', data.email],
            ['Phone', data.phone],
            ['Preferred contact method', data.contactMethod],
          ],
        },
        {
          heading: 'Requirement',
          rows: [
            ['Service required', data.service],
            ['Project details', data.projectDetails],
          ],
        },
      ],
    }),
  }),
})
