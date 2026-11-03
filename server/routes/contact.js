import { contactSchema } from '../../shared/schemas.js'
import { renderEmail } from '../lib/emailTemplate.js'
import { formHandler } from '../lib/formHandler.js'

export const handleContactForm = formHandler({
  name: 'contact',
  schema: contactSchema,
  successMessage: 'Thank you. Your message has been sent and our team will be in touch.',
  buildEmail: (data) => ({
    to: process.env.CONTACT_EMAIL || 'info@abibltd.co.uk',
    replyTo: data.email,
    subject: `Website enquiry: ${data.subject}`,
    ...renderEmail({
      title: 'New contact enquiry',
      intro: 'A visitor has sent a message through the website contact form. Reply to this email to respond directly.',
      sections: [
        {
          heading: 'Contact details',
          rows: [
            ['Name', data.name],
            ['Email', data.email],
            ['Phone', data.phone],
          ],
        },
        {
          heading: 'Enquiry',
          rows: [
            ['Subject', data.subject],
            ['Message', data.message],
          ],
        },
      ],
    }),
  }),
})
