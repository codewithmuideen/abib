// Validation rules shared by the browser forms and the API, so both sides
// enforce exactly the same constraints.
import { z } from 'zod'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const PHONE = /^[+()\d\s.-]{7,20}$/

const isRealDate = (value) => {
  if (!ISO_DATE.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

const text = (label, { min = 1, max = 200 } = {}) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .min(min, min === 1 ? `${label} is required.` : `${label} must be at least ${min} characters.`)
    .max(max, `${label} must be ${max} characters or fewer.`)

const optionalText = (label, max = 2000) =>
  z.string().trim().max(max, `${label} must be ${max} characters or fewer.`).optional().default('')

const email = z
  .string({ error: 'Email address is required.' })
  .trim()
  .min(1, 'Email address is required.')
  .max(254, 'Email address is too long.')
  .email('Enter a valid email address.')

const phone = z
  .string({ error: 'Telephone number is required.' })
  .trim()
  .min(1, 'Telephone number is required.')
  .regex(PHONE, 'Enter a valid telephone number.')

const optionalPhone = z
  .string()
  .trim()
  .refine((v) => v === '' || PHONE.test(v), 'Enter a valid telephone number.')
  .optional()
  .default('')

const date = (label) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .min(1, `${label} is required.`)
    .refine(isRealDate, `${label} must be a valid date.`)

const optionalDate = (label) =>
  z
    .string()
    .trim()
    .refine((v) => v === '' || isRealDate(v), `${label} must be a valid date.`)
    .optional()
    .default('')

const choice = (options, message = 'Please select an option.') => z.enum(options, { error: message })

// Spam trap: real visitors never see or fill this field.
export const HONEYPOT_FIELD = 'faxNumber'

export const SERVICE_OPTIONS = [
  'Plumbing Services',
  'Building Maintenance',
  'Property Maintenance',
  'Plumbing Repairs',
  'Installation Services',
  'Building Management Solutions',
  'Other / Not sure',
]

export const CONTACT_METHODS = ['Email', 'Telephone', 'Either']

/* ---------------------------------------------------------------- Contact */

export const contactSchema = z.object({
  name: text('Full name', { min: 2, max: 120 }),
  email,
  phone: optionalPhone,
  subject: text('Subject', { min: 2, max: 150 }),
  message: text('Message', { min: 10, max: 3000 }),
})

/* ------------------------------------------------------------------ Quote */

export const quoteSchema = z.object({
  name: text('Full name', { min: 2, max: 120 }),
  email,
  phone,
  service: choice(SERVICE_OPTIONS, 'Please select the service you require.'),
  projectDetails: text('Project details', { min: 20, max: 4000 }),
  contactMethod: choice(CONTACT_METHODS, 'Please choose a preferred contact method.'),
})

/* ------------------------------------------------- First week review */

export const DEPARTMENTS = ['Office', 'Site', 'Supervisor', 'Subcontractor']

export const ONBOARDING_ITEMS = [
  { key: 'welcomePack', label: 'Welcome pack received' },
  { key: 'healthSafety', label: 'Health & Safety induction completed' },
  { key: 'roleExplained', label: 'Role and responsibilities explained' },
  { key: 'policiesExplained', label: 'Policies and procedures explained' },
  { key: 'equipmentIssued', label: 'Equipment / tools issued' },
  { key: 'accessArranged', label: 'Access to systems / sites arranged' },
]

const RATING = ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement']

export const PERFORMANCE_QUESTIONS = [
  {
    key: 'understandsRole',
    label: 'Does the employee understand their role and daily tasks?',
    options: ['Yes', 'Mostly', 'No'],
  },
  {
    key: 'worksSafely',
    label: 'Is the employee able to carry out tasks safely and effectively?',
    options: ['Yes', 'With support', 'No'],
  },
  { key: 'qualityOfWork', label: 'Quality of work observed (if applicable)', options: RATING, optional: true },
  { key: 'attendance', label: 'Attendance & punctuality', options: RATING },
]

export const YES_NO = ['Yes', 'No']

export const REVIEW_OUTCOMES = [
  'First week completed successfully',
  'Additional support required',
  'Further review scheduled',
]

export const MAX_ACTIONS = 15

const actionRow = z.object({
  action: text('Action required', { min: 2, max: 300 }),
  responsible: text('Responsible person', { min: 2, max: 120 }),
  targetDate: date('Target date'),
})

export const reviewSchema = z
  .object({
    employeeName: text('Employee name', { min: 2, max: 120 }),
    jobTitle: text('Job title', { min: 2, max: 120 }),
    department: choice(DEPARTMENTS, 'Please select a department.'),
    startDate: date('Start date'),
    lineManager: text('Line manager / supervisor', { min: 2, max: 120 }),
    reviewDate: date('Review date'),

    onboarding: z.object(
      Object.fromEntries(ONBOARDING_ITEMS.map(({ key }) => [key, z.boolean().default(false)])),
    ),

    understandsRole: choice(PERFORMANCE_QUESTIONS[0].options),
    worksSafely: choice(PERFORMANCE_QUESTIONS[1].options),
    qualityOfWork: z.union([z.enum(RATING), z.literal('')]).optional().default(''),
    attendance: choice(RATING),

    trainingCompleted: choice(YES_NO),
    additionalTraining: choice(YES_NO),
    additionalTrainingDetails: optionalText('Training details', 2000),

    hasEquipment: choice(YES_NO),
    equipmentDetails: optionalText('Equipment details', 2000),

    employeeFirstWeek: text('First week feedback', { min: 5, max: 4000 }),
    employeeConcerns: optionalText('Concerns or support needed', 4000),

    managerComments: optionalText('Manager comments', 4000),

    actions: z.array(actionRow).max(MAX_ACTIONS, `No more than ${MAX_ACTIONS} actions.`).default([]),

    outcome: choice(REVIEW_OUTCOMES, 'Please select the review outcome.'),
    nextReviewDate: optionalDate('Next review date'),

    employeeSignature: text('Employee signature', { min: 2, max: 120 }),
    employeeSignatureDate: date('Employee signature date'),
    managerSignature: text('Manager / supervisor signature', { min: 2, max: 120 }),
    managerSignatureDate: date('Manager signature date'),
    confirmReviewed: z.literal(true, { error: 'Please confirm the information has been reviewed.' }),
  })
  .superRefine((data, ctx) => {
    const issue = (path, message) => ctx.addIssue({ code: 'custom', path: [path], message })

    if (data.reviewDate < data.startDate) issue('reviewDate', 'Review date cannot be before the start date.')

    if (data.additionalTraining === 'Yes' && data.additionalTrainingDetails.length < 2)
      issue('additionalTrainingDetails', 'Please specify the additional training required.')

    if (data.hasEquipment === 'No' && data.equipmentDetails.length < 2)
      issue('equipmentDetails', 'Please describe what is missing.')

    if (data.outcome === 'Further review scheduled' && !data.nextReviewDate)
      issue('nextReviewDate', 'Please set the next review date.')

    if (data.nextReviewDate && data.nextReviewDate < data.reviewDate)
      issue('nextReviewDate', 'Next review date cannot be before the review date.')

    if (data.employeeSignatureDate < data.startDate)
      issue('employeeSignatureDate', 'Signature date cannot be before the start date.')

    if (data.managerSignatureDate < data.startDate)
      issue('managerSignatureDate', 'Signature date cannot be before the start date.')
  })
