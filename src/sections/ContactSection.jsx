import { Suspense, lazy } from 'react'
import ContactDetails from '../components/ContactDetails'
import MapEmbed from '../components/MapEmbed'
import { Reveal } from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

// Loaded separately so form validation code stays out of the initial bundle.
const ContactForm = lazy(() => import('../components/ContactForm'))

export default function ContactSection({ showHeading = true }) {
  return (
    <section id="contact" className="section bg-paper" aria-label="Contact us">
      <div className="container">
        {showHeading && (
          <SectionHeading
            eyebrow="Contact"
            title="Get in touch with our team."
            intro="Call, email or send us a message using the form. We will respond as soon as we can."
          />
        )}

        <div className={`grid gap-14 lg:grid-cols-12 lg:gap-16 ${showHeading ? 'mt-14 lg:mt-20' : ''}`}>
          <div className="lg:col-span-5">
            <ContactDetails />
            <Reveal delay={0.2} className="mt-8">
              <MapEmbed className="aspect-[4/3]" />
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7" delay={0.1}>
            <div className="rounded-2xl border border-line bg-mist/60 p-6 sm:p-10">
              <h3 className="font-display text-2xl font-bold tracking-tight text-navy">Send us a message</h3>
              <p className="mb-8 mt-2 text-muted">Tell us a little about your property and what you need.</p>
              <Suspense fallback={<div className="min-h-[520px]" aria-busy="true" />}>
                <ContactForm />
              </Suspense>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
