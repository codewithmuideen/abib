import { ONBOARDING_ITEMS, PERFORMANCE_QUESTIONS, reviewSchema } from '../../shared/schemas.js'
import { formatDate, renderEmail } from '../lib/emailTemplate.js'
import { formHandler } from '../lib/formHandler.js'
import { isInviteConfigured, verifyInvite } from '../lib/reviewInvite.js'

const yesNo = (v) => (v ? 'Yes' : 'No')

const sendReview = formHandler({
  name: 'first-week-review',
  schema: reviewSchema,
  successMessage: 'The first week review has been submitted to HR.',
  buildEmail: (d, req) => ({
    to: process.env.HR_EMAIL || 'hr@abibltd.co.uk',
    subject: `New First Week Employee Review – ${d.employeeName}`,
    ...renderEmail({
      title: 'First Week Employee Review',
      intro: `Completed first week review for ${d.employeeName}, reviewed on ${formatDate(d.reviewDate)}. Submitted through personal review link ${req.invite.id}.`,
      sections: [
        {
          heading: '1. Employee details',
          rows: [
            ['Employee name', d.employeeName],
            ['Job title', d.jobTitle],
            ['Department', d.department],
            ['Start date', formatDate(d.startDate)],
            ['Line manager / supervisor', d.lineManager],
            ['Review date', formatDate(d.reviewDate)],
          ],
        },
        {
          heading: '2. Induction & onboarding check',
          rows: ONBOARDING_ITEMS.map(({ key, label }) => [label, yesNo(d.onboarding[key])]),
        },
        {
          heading: '3. Role understanding & performance',
          rows: PERFORMANCE_QUESTIONS.map(({ key, label }) => [label, d[key] || 'Not answered']),
        },
        {
          heading: '4. Training & support',
          rows: [
            ['Has all required training been completed?', d.trainingCompleted],
            ['Is additional training required?', d.additionalTraining],
            ['Additional training details', d.additionalTrainingDetails],
          ],
        },
        {
          heading: '5. Equipment & resources',
          rows: [
            ['Does the employee have all tools, equipment, and access required?', d.hasEquipment],
            ['Details of anything missing', d.equipmentDetails],
          ],
        },
        {
          heading: '6. Employee feedback',
          rows: [
            ['How has your first week been?', d.employeeFirstWeek],
            ['Any concerns or support needed?', d.employeeConcerns],
          ],
        },
        { heading: '7. Manager comments', rows: [['Manager observations and comments', d.managerComments]] },
        {
          heading: '8. Next actions',
          table: {
            columns: ['Action required', 'Responsible person', 'Target date'],
            rows: d.actions.map((a) => [a.action, a.responsible, formatDate(a.targetDate)]),
            empty: 'No next actions recorded.',
          },
        },
        {
          heading: '9. Review outcome',
          rows: [
            ['Outcome', d.outcome],
            ['Next review date', formatDate(d.nextReviewDate)],
          ],
        },
        {
          heading: '10. Signatures',
          rows: [
            ['Employee signature (typed)', d.employeeSignature],
            ['Employee signature date', formatDate(d.employeeSignatureDate)],
            ['Manager / supervisor signature (typed)', d.managerSignature],
            ['Manager signature date', formatDate(d.managerSignatureDate)],
            [
              'Confirmation',
              d.confirmReviewed
                ? 'Both parties confirm the information in this review has been discussed and reviewed.'
                : 'Not confirmed',
            ],
          ],
        },
      ],
    }),
  }),
})

/** Only accepts reviews sent from a valid personal link; the employee name always comes from the link. */
export function handleFirstWeekReview(req, res) {
  if (!isInviteConfigured()) {
    return res.status(503).json({ message: 'Review links are not set up yet. Please contact HR.' })
  }
  const invite = verifyInvite(req.body?.inviteToken)
  if (!invite)
    return res
      .status(403)
      .json({ message: 'This review link is invalid or has expired. Please ask HR for a new link.' })
  req.invite = invite
  req.body = { ...req.body, employeeName: invite.employeeName }
  return sendReview(req, res)
}
handleFirstWeekReview.schema = sendReview.schema
handleFirstWeekReview.buildEmail = sendReview.buildEmail
