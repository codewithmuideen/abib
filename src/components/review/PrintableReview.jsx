import { company } from '../../../shared/company'
import { ONBOARDING_ITEMS, PERFORMANCE_QUESTIONS } from '../../../shared/schemas'
import { formatDate } from '../../lib/format'

const show = (v) => (v === undefined || v === null || String(v).trim() === '' ? 'Not provided' : v)

function Block({ title, rows, children }) {
  return (
    <section className="mb-5 break-inside-avoid">
      <h2 className="mb-2 border-b-2 border-navy pb-1 font-display text-[11pt] font-bold uppercase tracking-wider text-navy">{title}</h2>
      {rows && (
        <table className="w-full border-collapse text-[9.5pt]">
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label} className="border-b border-line align-top">
                <th scope="row" className="w-[42%] py-1.5 pr-4 text-left font-medium text-muted">
                  {label}
                </th>
                <td className="whitespace-pre-wrap py-1.5 text-ink">{show(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {children}
    </section>
  )
}

/** Print-only rendering of a review (current draft or the submitted copy). */
export default function PrintableReview({ data, submitted }) {
  if (!data) return null
  const d = data
  return (
    <article className="hidden bg-white font-sans text-ink print:block">
      <header className="mb-6 flex items-end justify-between border-b border-line pb-4">
        <div>
          <img src="/images/logo/logo-horizontal-color.png" alt={company.name} className="h-12 w-auto" />
        </div>
        <div className="text-right text-[9pt] text-muted">
          <p>{company.address}</p>
          <p>
            {company.phone} · {company.hrEmail}
          </p>
        </div>
      </header>
      <h1 className="font-display text-[18pt] font-extrabold text-navy">FIRST WEEK EMPLOYEE REVIEW FORM</h1>
      <p className="mb-6 text-[10pt] text-muted">
        Employee onboarding, performance assessment and first-week review.
        {submitted ? ' Submitted copy.' : ' Draft, not yet submitted.'} Printed {formatDate(new Date().toISOString().slice(0, 10))}.
      </p>

      <Block
        title="1. Employee details"
        rows={[
          ['Employee name', d.employeeName],
          ['Job title', d.jobTitle],
          ['Department', d.department],
          ['Start date', formatDate(d.startDate)],
          ['Line manager / supervisor', d.lineManager],
          ['Review date', formatDate(d.reviewDate)],
        ]}
      />
      <Block
        title="2. Induction & onboarding check"
        rows={ONBOARDING_ITEMS.map(({ key, label }) => [label, d.onboarding?.[key] ? '☑ Yes' : '☐ No'])}
      />
      <Block title="3. Role understanding & performance" rows={PERFORMANCE_QUESTIONS.map(({ key, label }) => [label, d[key]])} />
      <Block
        title="4. Training & support"
        rows={[
          ['Has all required training been completed?', d.trainingCompleted],
          ['Is additional training required?', d.additionalTraining],
          ['If yes, please specify', d.additionalTrainingDetails],
        ]}
      />
      <Block
        title="5. Equipment & resources"
        rows={[
          ['Does the employee have all tools, equipment, and access required?', d.hasEquipment],
          ['If no, details', d.equipmentDetails],
        ]}
      />
      <Block
        title="6. Employee feedback"
        rows={[
          ['How has your first week been?', d.employeeFirstWeek],
          ['Any concerns or support needed?', d.employeeConcerns],
        ]}
      />
      <Block title="7. Manager comments" rows={[['Observations and comments', d.managerComments]]} />
      <Block title="8. Next actions">
        <table className="w-full border-collapse text-[9.5pt]">
          <thead>
            <tr className="border-b border-navy text-left text-navy">
              <th className="py-1.5 pr-3">Action required</th>
              <th className="py-1.5 pr-3">Responsible person</th>
              <th className="py-1.5">Target date</th>
            </tr>
          </thead>
          <tbody>
            {d.actions?.length ? (
              d.actions.map((a, i) => (
                <tr key={i} className="border-b border-line align-top">
                  <td className="py-1.5 pr-3">{show(a.action)}</td>
                  <td className="py-1.5 pr-3">{show(a.responsible)}</td>
                  <td className="py-1.5">{show(formatDate(a.targetDate))}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-1.5 text-muted">
                  No next actions recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Block>
      <Block
        title="9. Review outcome"
        rows={[
          ['Outcome', d.outcome],
          ['Next review date', formatDate(d.nextReviewDate)],
        ]}
      />
      <Block title="10. Signatures">
        <p className="mb-3 text-[9.5pt]">
          {d.confirmReviewed ? '☑' : '☐'} We confirm that the information in this review has been discussed and reviewed.
        </p>
        <div className="grid grid-cols-2 gap-8 text-[9.5pt]">
          {[
            ['Employee', d.employeeSignature, d.employeeSignatureDate],
            ['Manager / Supervisor', d.managerSignature, d.managerSignatureDate],
          ].map(([who, name, date]) => (
            <div key={who}>
              <p className="text-muted">{who} signature (typed)</p>
              <p className="mt-1 min-h-[1.6em] border-b border-ink font-display text-[12pt] italic">{name}</p>
              <p className="mt-2 text-muted">Date: {show(formatDate(date))}</p>
            </div>
          ))}
        </div>
      </Block>
      <footer className="mt-8 border-t border-line pt-2 text-[8pt] text-muted">
        {company.name} · Confidential HR record
      </footer>
    </article>
  )
}
