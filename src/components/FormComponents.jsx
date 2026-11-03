import { useId } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert, CircleCheck, LoaderCircle, Send } from 'lucide-react'
import { HONEYPOT_FIELD } from '../../shared/schemas'
import { getError } from '../lib/forms'
import { EASE } from '../lib/motion'
import Button from './Button'

const describedBy = (...ids) => ids.filter(Boolean).join(' ') || undefined

function Label({ htmlFor, required, children, as: Tag = 'label' }) {
  return (
    <Tag htmlFor={Tag === 'label' ? htmlFor : undefined} className="mb-2 block text-sm font-semibold text-navy">
      {children}
      {required ? (
        <span className="ml-1 text-royal" aria-hidden="true">
          *
        </span>
      ) : (
        <span className="ml-2 text-xs font-normal text-muted">(optional)</span>
      )}
    </Tag>
  )
}

export function ErrorText({ id, error }) {
  return (
    <AnimatePresence initial={false}>
      {error?.message && (
        <motion.p
          id={id}
          role="alert"
          className="mt-2 flex items-start gap-1.5 text-sm text-danger"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error.message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

function useField(name) {
  const id = useId()
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const error = getError(errors, name)
  return { id, error, register, errorId: `${id}-error`, hintId: `${id}-hint` }
}

export function TextField({ name, label, hint, required, type = 'text', className = '', ...props }) {
  const { id, error, register, errorId, hintId } = useField(name)
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {hint && (
        <p id={hintId} className="-mt-1 mb-2 text-sm text-muted">
          {hint}
        </p>
      )}
      <input
        id={id}
        type={type}
        className="field-control"
        aria-invalid={error ? 'true' : 'false'}
        aria-required={required || undefined}
        aria-describedby={describedBy(hint && hintId, error && errorId)}
        {...register(name)}
        {...props}
      />
      <ErrorText id={errorId} error={error} />
    </div>
  )
}

export function TextAreaField({ name, label, hint, required, rows = 5, maxLength, className = '', ...props }) {
  const { id, error, register, errorId, hintId } = useField(name)
  const value = useWatch({ name }) ?? ''
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {hint && (
        <p id={hintId} className="-mt-1 mb-2 text-sm text-muted">
          {hint}
        </p>
      )}
      <textarea
        id={id}
        rows={rows}
        maxLength={maxLength}
        className="field-control resize-y leading-relaxed"
        aria-invalid={error ? 'true' : 'false'}
        aria-required={required || undefined}
        aria-describedby={describedBy(hint && hintId, error && errorId)}
        {...register(name)}
        {...props}
      />
      <div className="flex items-start justify-between gap-4">
        <ErrorText id={errorId} error={error} />
        {maxLength && (
          <p className="ml-auto mt-2 shrink-0 text-xs tabular-nums text-muted" aria-hidden="true">
            {value.length.toLocaleString()} / {maxLength.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  )
}

export function SelectField({ name, label, options, placeholder = 'Please select', required, className = '', ...props }) {
  const { id, error, register, errorId } = useField(name)
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <select
        id={id}
        className="field-control"
        aria-invalid={error ? 'true' : 'false'}
        aria-required={required || undefined}
        aria-describedby={error ? errorId : undefined}
        {...register(name)}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ErrorText id={errorId} error={error} />
    </div>
  )
}

/** Accessible radio group rendered as selectable tiles. */
export function RadioGroup({ name, legend, options, required, columns = 'sm:grid-cols-3', className = '' }) {
  const { id, error, register, errorId } = useField(name)
  return (
    <fieldset className={className} aria-describedby={error ? errorId : undefined} aria-invalid={error ? 'true' : undefined}>
      <Label as="legend" required={required}>
        {legend}
      </Label>
      <div className={`grid grid-cols-1 gap-2 ${columns}`}>
        {options.map((option) => (
          <label key={option} className="relative block cursor-pointer">
            <input type="radio" value={option} className="peer sr-only" id={`${id}-${option}`} {...register(name)} />
            <span
              className={`flex min-h-12 items-center gap-3 rounded-2xl border bg-paper px-4 py-3 text-[0.95rem] text-ink transition-all duration-200 hover:border-steel peer-checked:border-royal peer-checked:bg-royal/[0.06] peer-checked:font-semibold peer-checked:text-navy peer-focus-visible:ring-4 peer-focus-visible:ring-sky/30 peer-checked:[&>i]:border-[5px] peer-checked:[&>i]:border-royal ${
                error ? 'border-danger/60' : 'border-line'
              }`}
            >
              <i aria-hidden="true" className="h-4 w-4 shrink-0 rounded-full border-2 border-steel bg-paper transition-all" />
              {option}
            </span>
          </label>
        ))}
      </div>
      <ErrorText id={errorId} error={error} />
    </fieldset>
  )
}

export function CheckboxField({ name, label, description, required, className = '' }) {
  const { id, error, register, errorId } = useField(name)
  return (
    <div className={className}>
      <label htmlFor={id} className="group flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-xl border-line accent-royal"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          aria-required={required || undefined}
          {...register(name)}
        />
        <span className="text-[0.95rem] leading-snug text-ink">
          {label}
          {description && <span className="mt-1 block text-sm text-muted">{description}</span>}
        </span>
      </label>
      <ErrorText id={errorId} error={error} />
    </div>
  )
}

/** Hidden spam trap; bots that fill it are rejected by the API. */
export function Honeypot() {
  const { register } = useFormContext()
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Fax number (leave blank)
        <input type="text" tabIndex={-1} autoComplete="off" {...register(HONEYPOT_FIELD)} />
      </label>
    </div>
  )
}

export function FormAlert({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-danger/25 bg-danger/[0.06] p-4 text-sm text-danger"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function SubmitButton({ submitting, children, className = '' }) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={submitting}
      aria-busy={submitting}
      icon={submitting ? SpinningLoader : Send}
      className={className}
    >
      {submitting ? 'Sending…' : children}
    </Button>
  )
}

function SpinningLoader(props) {
  return <LoaderCircle {...props} className={`${props.className} animate-spin`} />
}

export function SuccessPanel({ title, message, children }) {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="flex flex-col items-start rounded-2xl border border-line bg-paper p-8 shadow-card sm:p-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <motion.span
        className="grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
      >
        <CircleCheck className="h-8 w-8" aria-hidden="true" />
      </motion.span>
      <h2 className="heading-md mt-6 text-navy">{title}</h2>
      <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted">{message}</p>
      {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
    </motion.div>
  )
}

export function RequiredNote() {
  return (
    <p className="text-sm text-muted">
      Fields marked <span className="text-royal">*</span> are required.
    </p>
  )
}
