import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { contactSchema } from '../../shared/schemas'
import useFormSubmit from '../hooks/useFormSubmit'
import { submitContact } from '../services/api'
import Button from './Button'
import { FormAlert, Honeypot, RequiredNote, SubmitButton, SuccessPanel, TextAreaField, TextField } from './FormComponents'

const defaults = { name: '', email: '', phone: '', subject: '', message: '', faxNumber: '' }

export default function ContactForm() {
  const form = useForm({ resolver: zodResolver(contactSchema), defaultValues: defaults, mode: 'onTouched' })
  const { status, message, submitting, submit, reset } = useFormSubmit(submitContact, form.setError)

  const onSubmit = async (values) => {
    if (await submit(values)) form.reset(defaults)
  }

  if (status === 'success') {
    return (
      <SuccessPanel title="Message sent" message={message}>
        <Button variant="outline" onClick={reset}>
          Send another message
        </Button>
      </SuccessPanel>
    )
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="relative space-y-6" aria-label="Contact form">
        <Honeypot />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField name="name" label="Full name" required autoComplete="name" />
          <TextField name="email" label="Email address" type="email" required autoComplete="email" inputMode="email" />
          <TextField name="phone" label="Telephone" type="tel" autoComplete="tel" inputMode="tel" />
          <TextField name="subject" label="Subject" required />
        </div>
        <TextAreaField name="message" label="Message" required rows={6} maxLength={3000} />
        <FormAlert message={status === 'error' ? message : ''} />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <RequiredNote />
          <SubmitButton submitting={submitting}>Send message</SubmitButton>
        </div>
        <p className="text-sm text-muted">
          We use your details only to respond to your enquiry. See our{' '}
          <Link to="/privacy-policy" className="font-medium text-royal underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>
      </form>
    </FormProvider>
  )
}
