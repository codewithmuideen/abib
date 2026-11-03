import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { ClipboardList, Lock, Printer, RotateCcw } from 'lucide-react'
import { company } from '../../shared/company'
import {
  DEPARTMENTS,
  ONBOARDING_ITEMS,
  PERFORMANCE_QUESTIONS,
  REVIEW_OUTCOMES,
  YES_NO,
  reviewSchema,
} from '../../shared/schemas'
import { todayISO } from '../lib/format'
import useFormSubmit from '../hooks/useFormSubmit'
import { submitFirstWeekReview } from '../services/api'
import Button from '../components/Button'
import {
  CheckboxField,
  FormAlert,
  Honeypot,
  RadioGroup,
  RequiredNote,
  SubmitButton,
  SuccessPanel,
  TextAreaField,
  TextField,
} from '../components/FormComponents'
import Seo from '../components/Seo'
import ActionsEditor from '../components/review/ActionsEditor'
import PrintableReview from '../components/review/PrintableReview'
import ReviewSection from '../components/review/ReviewSection'

const makeDefaults = () => ({
  employeeName: '',
  jobTitle: '',
  department: '',
  startDate: '',
  lineManager: '',
  reviewDate: todayISO(),
  onboarding: Object.fromEntries(ONBOARDING_ITEMS.map(({ key }) => [key, false])),
  understandsRole: '',
  worksSafely: '',
  qualityOfWork: '',
  attendance: '',
  trainingCompleted: '',
  additionalTraining: '',
  additionalTrainingDetails: '',
  hasEquipment: '',
  equipmentDetails: '',
  employeeFirstWeek: '',
  employeeConcerns: '',
  managerComments: '',
  actions: [],
  outcome: '',
  nextReviewDate: '',
  employeeSignature: '',
  employeeSignatureDate: '',
  managerSignature: '',
  managerSignatureDate: '',
  confirmReviewed: false,
  faxNumber: '',
})

const SECTIONS = [
  'Employee details',
  'Induction & onboarding',
  'Role understanding & performance',
  'Training & support',
  'Equipment & resources',
  'Employee feedback',
  'Manager comments',
  'Next actions',
  'Review outcome',
  'Signatures',
]

const filled = (...values) => values.every((v) => typeof v === 'string' && v.trim() !== '')

/** Works out which sections are complete, for the progress sidebar. */
function sectionStatus(v) {
  const done = {
    1: filled(v.employeeName, v.jobTitle, v.department, v.startDate, v.lineManager, v.reviewDate),
    2: ONBOARDING_ITEMS.every(({ key }) => v.onboarding?.[key]),
    3: filled(v.understandsRole, v.worksSafely, v.attendance),
    4:
      filled(v.trainingCompleted, v.additionalTraining) &&
      (v.additionalTraining !== 'Yes' || filled(v.additionalTrainingDetails)),
    5: filled(v.hasEquipment) && (v.hasEquipment !== 'No' || filled(v.equipmentDetails)),
    6: filled(v.employeeFirstWeek),
    7: filled(v.managerComments),
    8: (v.actions ?? []).length > 0 && v.actions.every((a) => filled(a.action, a.responsible, a.targetDate)),
    9: filled(v.outcome) && (v.outcome !== 'Further review scheduled' || filled(v.nextReviewDate)),
    10:
      filled(v.employeeSignature, v.employeeSignatureDate, v.managerSignature, v.managerSignatureDate) &&
      v.confirmReviewed === true,
  }
  const required = [1, 3, 4, 5, 6, 9, 10]
  const progress = Math.round((required.filter((n) => done[n]).length / required.length) * 100)
  return { done, progress }
}

function Conditional({ show, children }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden"
        >
          <div className="pt-1">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SignaturePreview({ name }) {
  const value = useWatch({ name })
  return (
    <div className="flex min-h-14 items-end border-b-2 border-navy/70 px-1 pb-1" aria-hidden="true">
      <span className="font-display text-2xl font-semibold italic text-navy/80">{value || ' '}</span>
    </div>
  )
}

function ProgressSidebar({ status }) {
  const go = (n) =>
    document.getElementById(`review-section-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return (
    <nav aria-label="Form sections" className="rounded-2xl border border-line bg-paper p-5 shadow-card">
      <div className="flex items-baseline justify-between">
        <p className="font-display text-sm font-bold text-navy">Progress</p>
        <p className="font-display text-sm font-bold tabular-nums text-royal">{status.progress}%</p>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuenow={status.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Required sections completed"
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-royal to-sky"
          animate={{ width: `${status.progress}%` }}
        />
      </div>
      <ol className="mt-5 hidden space-y-0.5 lg:block">
        {SECTIONS.map((title, i) => {
          const n = i + 1
          const done = status.done[n]
          return (
            <li key={title}>
              <button
                type="button"
                onClick={() => go(n)}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm text-ink transition-colors hover:bg-mist"
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.7rem] font-bold transition-colors ${
                    done ? 'bg-success text-white' : 'border border-line text-muted'
                  }`}
                >
                  {done ? '✓' : n}
                </span>
                <span className={done ? 'text-navy' : ''}>{title}</span>
                {done && <span className="sr-only">(complete)</span>}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default function FirstWeekReview() {
  const defaults = useMemo(() => makeDefaults(), [])
  const form = useForm({ resolver: zodResolver(reviewSchema), defaultValues: defaults, mode: 'onTouched' })
  const { control, setValue, getValues, reset: resetForm, formState } = form
  const {
    status,
    message,
    submitting,
    submit,
    reset: resetStatus,
  } = useFormSubmit(submitFirstWeekReview, form.setError)

  const [submitted, setSubmitted] = useState(null)
  const [printData, setPrintData] = useState(null)
  const values = useWatch({ control })
  const progress = sectionStatus(values)

  const startDate = values.startDate || undefined
  const reviewDate = values.reviewDate || undefined

  // Clear conditional answers when the question that reveals them changes,
  // so hidden text is never submitted.
  useEffect(() => {
    if (values.additionalTraining !== 'Yes' && getValues('additionalTrainingDetails'))
      setValue('additionalTrainingDetails', '')
  }, [values.additionalTraining, getValues, setValue])
  useEffect(() => {
    if (values.hasEquipment !== 'No' && getValues('equipmentDetails')) setValue('equipmentDetails', '')
  }, [values.hasEquipment, getValues, setValue])

  // Print the submitted copy after success, otherwise the current draft.
  const printSource = useRef(() => null)
  useEffect(() => {
    printSource.current = () => submitted ?? getValues()
  }, [submitted, getValues])
  useEffect(() => {
    const before = () => flushSync(() => setPrintData(printSource.current()))
    window.addEventListener('beforeprint', before)
    return () => window.removeEventListener('beforeprint', before)
  }, [])
  const print = useCallback(() => {
    flushSync(() => setPrintData(printSource.current()))
    window.print()
  }, [])

  // Warn before leaving with unsaved answers.
  const unsaved = formState.isDirty && !submitted
  useEffect(() => {
    if (!unsaved) return
    const warn = (e) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [unsaved])

  const onSubmit = async (data) => {
    const ok = await submit(data)
    if (ok) {
      setSubmitted(data)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const startNew = () => {
    resetForm(makeDefaults())
    setSubmitted(null)
    resetStatus()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onInvalid = () => {
    resetStatus()
  }

  const errorCount = Object.keys(formState.errors).length

  return (
    <>
      <Seo
        title="First Week Employee Review"
        path="/first-week-review"
        description="Internal HR form for completing first week employee reviews at Abib Plumbing & Building Management Ltd."
        noindex
      />

      <div className="print:hidden">
        <section className="px-2 pt-2 sm:px-3 sm:pt-3">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-[#D5E2EF] via-[#E6EEF6] to-[#F4F8FC] sm:rounded-[36px]">
            <div className="container pb-12 pt-[calc(var(--nav-h)+2.5rem)] md:pt-[calc(var(--nav-h)+3.5rem)] lg:pb-14">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-paper/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-navy shadow-sm">
                    <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Internal HR form
                  </p>
                  <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-5xl">
                    FIRST WEEK EMPLOYEE REVIEW FORM
                  </h1>
                  <p className="mt-4 max-w-2xl text-lg text-muted">
                    Employee onboarding, performance assessment and first-week review.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" icon={Printer} onClick={print}>
                    {submitted ? 'Print submitted review' : 'Print form'}
                  </Button>
                </div>
              </div>
              <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white bg-line text-sm shadow-card sm:grid-cols-3">
                {[
                  ['Submitted to', company.hrEmail],
                  ['Sections', '10'],
                  ['Required fields', 'Marked with *'],
                ].map(([k, v]) => (
                  <div key={k} className="bg-paper/90 px-5 py-4">
                    <dt className="text-xs uppercase tracking-[0.16em] text-muted">{k}</dt>
                    <dd className="mt-1 font-semibold text-navy">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <div className="py-12 lg:py-16">
          <div className="container">
            {submitted ? (
              <div className="mx-auto max-w-3xl">
                <SuccessPanel
                  title="Review submitted"
                  message={`${message} A copy has been emailed to ${company.hrEmail} for ${submitted.employeeName}.`}
                >
                  <Button icon={Printer} onClick={print}>
                    Print submitted review
                  </Button>
                  <Button variant="outline" icon={RotateCcw} onClick={startNew}>
                    Start a new review
                  </Button>
                </SuccessPanel>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-12">
                <aside className="lg:col-span-3">
                  <div className="lg:sticky lg:top-28">
                    <ProgressSidebar status={progress} />
                    <p className="mt-4 hidden items-start gap-2 px-1 text-xs leading-relaxed text-muted lg:flex">
                      <ClipboardList className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      Answers are not saved until the form is submitted. Use Print to keep a paper copy.
                    </p>
                  </div>
                </aside>

                <FormProvider {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                    noValidate
                    className="relative space-y-6 lg:col-span-9"
                    aria-label="First week employee review form"
                  >
                    <Honeypot />

                    <ReviewSection number={1} title="Employee details" status={progress.done[1] && 'done'}>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <TextField name="employeeName" label="Employee name" required autoComplete="off" />
                        <TextField name="jobTitle" label="Job title" required autoComplete="off" />
                      </div>
                      <RadioGroup
                        name="department"
                        legend="Department"
                        options={DEPARTMENTS}
                        required
                        columns="grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-4"
                      />
                      <div className="grid gap-6 sm:grid-cols-3">
                        <TextField name="startDate" label="Start date" type="date" required />
                        <TextField
                          name="lineManager"
                          label="Line manager / supervisor"
                          required
                          autoComplete="off"
                          className="sm:col-span-2"
                        />
                        <TextField name="reviewDate" label="Review date" type="date" required min={startDate} />
                      </div>
                    </ReviewSection>

                    <ReviewSection
                      number={2}
                      title="Induction & onboarding check"
                      description={`Tick each item that has been completed (${ONBOARDING_ITEMS.filter(({ key }) => values.onboarding?.[key]).length} of ${ONBOARDING_ITEMS.length}).`}
                      status={progress.done[2] && 'done'}
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        {ONBOARDING_ITEMS.map(({ key, label }) => (
                          <CheckboxField
                            key={key}
                            name={`onboarding.${key}`}
                            label={label}
                            className="rounded-2xl border border-line p-4 transition-colors has-[:checked]:border-royal/50 has-[:checked]:bg-royal/[0.04]"
                          />
                        ))}
                      </div>
                    </ReviewSection>

                    <ReviewSection
                      number={3}
                      title="Role understanding & performance"
                      status={progress.done[3] && 'done'}
                    >
                      {PERFORMANCE_QUESTIONS.map((q, i) => (
                        <RadioGroup
                          key={q.key}
                          name={q.key}
                          legend={`${i + 1}. ${q.label}`}
                          options={q.options}
                          required={!q.optional}
                          columns={q.options.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'sm:grid-cols-3'}
                        />
                      ))}
                    </ReviewSection>

                    <ReviewSection number={4} title="Training & support" status={progress.done[4] && 'done'}>
                      <div className="grid gap-7 md:grid-cols-2">
                        <RadioGroup
                          name="trainingCompleted"
                          legend="Has all required training been completed?"
                          options={YES_NO}
                          required
                          columns="grid-cols-2"
                        />
                        <RadioGroup
                          name="additionalTraining"
                          legend="Is additional training required?"
                          options={YES_NO}
                          required
                          columns="grid-cols-2"
                        />
                      </div>
                      <Conditional show={values.additionalTraining === 'Yes'}>
                        <TextAreaField
                          name="additionalTrainingDetails"
                          label="If yes, please specify"
                          required
                          rows={3}
                          maxLength={2000}
                        />
                      </Conditional>
                    </ReviewSection>

                    <ReviewSection number={5} title="Equipment & resources" status={progress.done[5] && 'done'}>
                      <RadioGroup
                        name="hasEquipment"
                        legend="Does the employee have all tools, equipment, and access required?"
                        options={YES_NO}
                        required
                        columns="grid-cols-2 sm:max-w-md"
                      />
                      <Conditional show={values.hasEquipment === 'No'}>
                        <TextAreaField
                          name="equipmentDetails"
                          label="If no, provide details"
                          required
                          rows={3}
                          maxLength={2000}
                        />
                      </Conditional>
                    </ReviewSection>

                    <ReviewSection
                      number={6}
                      title="Employee feedback"
                      description="To be completed by the employee."
                      status={progress.done[6] && 'done'}
                    >
                      <TextAreaField
                        name="employeeFirstWeek"
                        label="How has your first week been?"
                        required
                        rows={6}
                        maxLength={4000}
                      />
                      <TextAreaField
                        name="employeeConcerns"
                        label="Any concerns or support needed?"
                        rows={5}
                        maxLength={4000}
                      />
                    </ReviewSection>

                    <ReviewSection number={7} title="Manager comments" status={progress.done[7] && 'done'}>
                      <TextAreaField
                        name="managerComments"
                        label="Manager observations and comments"
                        rows={7}
                        maxLength={4000}
                      />
                    </ReviewSection>

                    <ReviewSection
                      number={8}
                      title="Next actions"
                      description="Record any agreed follow-up actions."
                      status={progress.done[8] && 'done'}
                    >
                      <ActionsEditor minDate={reviewDate} />
                    </ReviewSection>

                    <ReviewSection number={9} title="Review outcome" status={progress.done[9] && 'done'}>
                      <RadioGroup
                        name="outcome"
                        legend="Outcome"
                        options={REVIEW_OUTCOMES}
                        required
                        columns="sm:grid-cols-3"
                      />
                      <TextField
                        name="nextReviewDate"
                        label="Next review date (if applicable)"
                        type="date"
                        required={values.outcome === 'Further review scheduled'}
                        min={reviewDate}
                        className="sm:max-w-xs"
                      />
                    </ReviewSection>

                    <ReviewSection
                      number={10}
                      title="Signatures"
                      description="Type your full name to sign."
                      status={progress.done[10] && 'done'}
                    >
                      <div className="grid gap-8 md:grid-cols-2">
                        {[
                          ['employee', 'Employee'],
                          ['manager', 'Manager / Supervisor'],
                        ].map(([who, label]) => (
                          <div key={who} className="space-y-5 rounded-2xl border border-line bg-mist/50 p-5">
                            <p className="font-display text-sm font-bold uppercase tracking-wider text-navy">{label}</p>
                            <SignaturePreview name={`${who}Signature`} />
                            <TextField
                              name={`${who}Signature`}
                              label={`${label} signature (typed full name)`}
                              required
                              autoComplete="off"
                            />
                            <TextField
                              name={`${who}SignatureDate`}
                              label="Signature date"
                              type="date"
                              required
                              min={startDate}
                            />
                          </div>
                        ))}
                      </div>
                      <CheckboxField
                        name="confirmReviewed"
                        required
                        label="We confirm that the information in this review has been discussed and reviewed by both the employee and the manager / supervisor, and is accurate."
                        className="rounded-2xl border border-royal/25 bg-royal/[0.04] p-5"
                      />
                    </ReviewSection>

                    <div className="rounded-2xl border border-line bg-paper px-5 py-6 shadow-card sm:px-8">
                      <div className="space-y-4">
                        {errorCount > 0 && status !== 'error' && (
                          <p role="alert" className="text-sm font-medium text-danger">
                            Please complete the highlighted fields before submitting.
                          </p>
                        )}
                        <FormAlert message={status === 'error' ? message : ''} />
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <RequiredNote />
                          <div className="flex flex-col gap-3 sm:flex-row">
                            <Button variant="outline" icon={Printer} onClick={print}>
                              Print
                            </Button>
                            <SubmitButton submitting={submitting}>Submit employee review</SubmitButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </div>
            )}
          </div>
        </div>
      </div>

      <PrintableReview data={printData} submitted={Boolean(submitted)} />
    </>
  )
}
