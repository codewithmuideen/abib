import { Link } from 'react-router-dom'
import { company } from '../../shared/company'
import { images } from '../data/content'
import PageHero from '../components/PageHero'
import Seo from '../components/Seo'

const LAST_UPDATED = '3 November 2026'

const sections = [
  {
    title: 'Who we are',
    body: (
      <>
        <p>
          This website is operated by {company.name} (“Abib”, “we”, “us”), {company.address}. For any question about this
          policy or your personal information, contact us at{' '}
          <a href={`mailto:${company.email}`}>{company.email}</a> or on <a href={company.phoneHref}>{company.phone}</a>.
        </p>
      </>
    ),
  },
  {
    title: 'Information we collect',
    body: (
      <>
        <p>We only collect personal information that you choose to send us through the forms on this website:</p>
        <ul>
          <li>
            <strong>Contact form:</strong> your name, email address, telephone number (optional), subject and message.
          </li>
          <li>
            <strong>Quote request form:</strong> your name, email address, telephone number, the service you require,
            project details and preferred contact method.
          </li>
          <li>
            <strong>Careers form:</strong> your name, email address, telephone number, the position you are applying for,
            your cover message and, if you choose to upload one, your CV.
          </li>
          <li>
            <strong>First Week Employee Review form</strong> (for staff): the employee and manager details, review
            answers, comments, agreed actions, dates and typed signature names entered into the form.
          </li>
        </ul>
        <p>
          The website does not use analytics, advertising or tracking cookies, and does not ask you to create an account.
        </p>
      </>
    ),
  },
  {
    title: 'How we use your information',
    body: (
      <ul>
        <li>To respond to enquiries and quote requests, and to discuss the work you have asked about.</li>
        <li>To consider job applications and contact applicants about them.</li>
        <li>To keep an HR record of employee first week reviews.</li>
        <li>To protect the website from spam and misuse.</li>
      </ul>
    ),
  },
  {
    title: 'How your information is sent and stored',
    body: (
      <>
        <p>
          Form submissions are not stored in a database on this website. When you submit a form, our server checks the
          information and sends it by email to the relevant Abib mailbox: general enquiries and quote requests go to{' '}
          {company.email}; careers applications and employee reviews go to {company.hrEmail}. Uploaded CVs are attached to
          that email and are not kept on the web server.
        </p>
        <p>
          Emails are delivered using Resend, a third-party email delivery service, which processes the content of the
          email on our behalf in order to deliver it. Resend may process data outside the UK.
        </p>
        <p>
          To limit spam, the server temporarily keeps a count of form submissions made from each IP address for a short
          period (a few minutes). Our hosting provider may also keep standard server logs, such as IP addresses and the
          pages requested, for security and operational purposes.
        </p>
      </>
    ),
  },
  {
    title: 'Third-party content',
    body: (
      <p>
        The map on our contact pages is provided by Google Maps and is only loaded if you choose “Show map”. When loaded,
        Google may receive information such as your IP address and set its own cookies, in line with Google’s privacy
        policy. Links to “Get directions” open Google Maps in a new tab.
      </p>
    ),
  },
  {
    title: 'How long we keep information',
    body: (
      <p>
        We keep enquiry, application and HR emails only for as long as they are needed for the purpose they were sent
        for, and for any related legal, contractual or record-keeping requirements. When information is no longer
        needed, it is deleted.
      </p>
    ),
  },
  {
    title: 'Your rights',
    body: (
      <>
        <p>
          Under UK data protection law you may have the right to ask for a copy of the personal information we hold about
          you, to ask us to correct or delete it, to object to or restrict how we use it, and to ask us to transfer it. To
          make a request, contact us using the details above.
        </p>
        <p>
          If you are unhappy with how we have handled your information, you can complain to the Information
          Commissioner’s Office (ICO) at{' '}
          <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
            ico.org.uk
          </a>
          .
        </p>
      </>
    ),
  },
  {
    title: 'Changes to this policy',
    body: <p>We may update this policy from time to time. The date at the top of the page shows when it was last changed.</p>,
  },
]

export default function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        path="/privacy-policy"
        description="How Abib Plumbing & Building Management Ltd collects, uses and handles information submitted through this website."
      />
      <PageHero
        crumb="Privacy Policy"
        eyebrow="Legal"
        title={['Privacy Policy']}
        intro="How we collect, use and look after the information you send us through this website."
        image={images.privacy}
      />
      <section className="section bg-paper">
        <div className="container grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="text-sm text-muted">Last updated {LAST_UPDATED}</p>
              <nav aria-label="Policy sections" className="mt-6 hidden lg:block">
                <ol className="space-y-2 border-l border-line">
                  {sections.map((s, i) => (
                    <li key={s.title}>
                      <a href={`#policy-${i + 1}`} className="-ml-px block border-l-2 border-transparent pl-4 text-sm text-muted transition-colors hover:border-royal hover:text-navy">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </aside>
          <div className="max-w-3xl space-y-12 lg:col-span-8 [&_a]:font-medium [&_a]:text-royal [&_a]:underline [&_a]:underline-offset-2 [&_li]:pl-1 [&_p]:leading-relaxed [&_p]:text-muted [&_strong]:text-navy [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-muted">
            {sections.map((s, i) => (
              <section key={s.title} id={`policy-${i + 1}`} className="scroll-mt-28 space-y-4">
                <h2 className="font-display text-2xl font-bold tracking-tight text-navy">
                  <span className="mr-3 text-sky">{String(i + 1).padStart(2, '0')}</span>
                  {s.title}
                </h2>
                {s.body}
              </section>
            ))}
            <p className="border-t border-line pt-8 text-sm">
              Questions? <Link to="/contact">Contact us</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
