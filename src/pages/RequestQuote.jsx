import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Clock, Mail, Phone } from 'lucide-react'
import { company } from '../../shared/company'
import { CONTACT_METHODS, SERVICE_OPTIONS, quoteSchema } from '../../shared/schemas'
import { images } from '../data/content'
import useFormSubmit from '../hooks/useFormSubmit'
import { submitQuote } from '../services/api'
import Button from '../components/Button'
import {
  FormAlert,
  Honeypot,
  RadioGroup,
  RequiredNote,
  SelectField,
  SubmitButton,
  SuccessPanel,
  TextAreaField,
  TextField,
} from '../components/FormComponents'
import PageHero from '../components/PageHero'
import { Reveal, RevealGroup, RevealItem } from '../components/Reveal'
import Seo from '../components/Seo'

const steps = [
  { title: 'Tell us what you need', text: 'Share a few details about the property and the work required.' },
  { title: 'We review your request', text: 'Our team looks at your requirements and may contact you for more information.' },
  { title: 'We get back to you', text: 'We will contact you using your preferred method to discuss next steps.' },
]

export default function RequestQuote() {
  const [params] = useSearchParams()
  const defaults = useMemo(() => {
    const service = params.get('service')
    return {
      name: '',
      email: '',
      phone: '',
      service: SERVICE_OPTIONS.includes(service) ? service : '',
      projectDetails: '',
      contactMethod: '',
      faxNumber: '',
    }
  }, [params])

  const form = useForm({ resolver: zodResolver(quoteSchema), defaultValues: defaults, mode: 'onTouched' })
  const { status, message, submitting, submit, reset } = useFormSubmit(submitQuote, form.setError)

  const onSubmit = async (values) => {
    if (await submit(values)) form.reset({ ...defaults, service: '' })
  }

  return (
    <>
      <Seo
        title="Request a Quote"
        path="/request-a-quote"
        description="Request a quote from Abib Plumbing & Building Management Ltd for plumbing, maintenance, installation or building management work."
      />
      <PageHero
        crumb="Request a Quote"
        eyebrow="Request a Quote"
        title={['Tell us about', { text: 'your project.', className: 'text-sky' }]}
        intro="Complete the form below and our team will review your requirements and be in touch."
        image={images.quote}
      />

      <section className="section bg-mist">
        <div className="container grid gap-14 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <p className="eyebrow">What happens next</p>
              </Reveal>
              <RevealGroup as="ol" className="mt-8 space-y-8">
                {steps.map((s, i) => (
                  <RevealItem as="li" key={s.title} className="flex gap-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-royal font-display text-sm font-bold text-royal">
                      {i + 1}
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-bold text-navy">{s.title}</h2>
                      <p className="mt-1 leading-relaxed text-muted">{s.text}</p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>

              <Reveal delay={0.2} className="mt-12 bg-navy p-7 text-white">
                <p className="flex items-center gap-2 text-sm text-white/70">
                  <Clock className="h-4 w-4 text-sky" aria-hidden="true" /> Prefer to speak to someone?
                </p>
                <a href={company.phoneHref} className="mt-3 flex items-center gap-3 font-display text-2xl font-bold hover:text-sky">
                  <Phone className="h-5 w-5 text-sky" aria-hidden="true" /> {company.phone}
                </a>
                <a href={`mailto:${company.email}`} className="mt-3 flex items-center gap-3 text-white/80 hover:text-white">
                  <Mail className="h-4 w-4 text-sky" aria-hidden="true" /> {company.email}
                </a>
              </Reveal>
            </div>
          </aside>

          <Reveal className="lg:col-span-8" delay={0.1}>
            {status === 'success' ? (
              <SuccessPanel title="Quote request received" message={message}>
                <Button variant="outline" onClick={reset}>
                  Submit another request
                </Button>
                <Button to="/" variant="dark">
                  Back to home
                </Button>
              </SuccessPanel>
            ) : (
              <div className="rounded-2xl border border-line bg-paper p-6 shadow-card sm:p-10">
                <h2 className="heading-md text-navy">Quote request</h2>
                <p className="mb-10 mt-2 text-muted">The more detail you can share, the better we can understand your requirements.</p>
                <FormProvider {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="relative space-y-7" aria-label="Quote request form">
                    <Honeypot />
                    <div className="grid gap-6 sm:grid-cols-2">
                      <TextField name="name" label="Full name" required autoComplete="name" className="sm:col-span-2" />
                      <TextField name="email" label="Email address" type="email" required autoComplete="email" inputMode="email" />
                      <TextField name="phone" label="Telephone" type="tel" required autoComplete="tel" inputMode="tel" />
                    </div>
                    <SelectField name="service" label="Service required" options={SERVICE_OPTIONS} required />
                    <TextAreaField
                      name="projectDetails"
                      label="Project details"
                      hint="Include the property type, location and a description of the work."
                      required
                      rows={7}
                      maxLength={4000}
                    />
                    <RadioGroup name="contactMethod" legend="Preferred contact method" options={CONTACT_METHODS} required />
                    <FormAlert message={status === 'error' ? message : ''} />
                    <div className="flex flex-col gap-5 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
                      <RequiredNote />
                      <SubmitButton submitting={submitting}>Request a quote</SubmitButton>
                    </div>
                  </form>
                </FormProvider>
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}
