import { useId } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { ListPlus, Plus, Trash2 } from 'lucide-react'
import { MAX_ACTIONS } from '../../../shared/schemas'
import { ErrorText } from '../FormComponents'

const COLUMNS = 'md:grid-cols-[minmax(0,1fr)_minmax(0,220px)_170px_44px]'

function Cell({ index, field, label, type = 'text', min }) {
  const id = useId()
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const error = errors.actions?.[index]?.[field]
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted md:sr-only">
        {label}
        <span className="sr-only"> for action {index + 1}</span>
      </label>
      <input
        id={id}
        type={type}
        min={min}
        className="field-control"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        {...register(`actions.${index}.${field}`)}
      />
      <ErrorText id={`${id}-error`} error={error} />
    </div>
  )
}

/** Repeatable "next actions" table: a grid on desktop, stacked cards on mobile. */
export default function ActionsEditor({ minDate }) {
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({ control, name: 'actions' })
  const addRow = () => append({ action: '', responsible: '', targetDate: '' }, { shouldFocus: true })

  return (
    <div>
      {fields.length > 0 && (
        <div className={`hidden gap-4 border-b border-line pb-3 text-xs font-semibold uppercase tracking-wider text-muted md:grid ${COLUMNS}`}>
          <span>Action required</span>
          <span>Responsible person</span>
          <span>Target date</span>
          <span className="sr-only">Remove</span>
        </div>
      )}

      <ol className="space-y-4 md:space-y-0">
        <AnimatePresence initial={false}>
          {fields.map((field, index) => (
            <motion.li
              key={field.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div
                className={`grid gap-4 rounded-2xl border border-line bg-mist/50 p-4 md:items-start md:rounded-none md:border-0 md:border-b md:bg-transparent md:px-0 md:py-4 ${COLUMNS}`}
              >
                <div className="flex items-center justify-between md:hidden">
                  <span className="font-display text-sm font-bold text-navy">Action {index + 1}</span>
                </div>
                <Cell index={index} field="action" label="Action required" />
                <Cell index={index} field="responsible" label="Responsible person" />
                <Cell index={index} field="targetDate" label="Target date" type="date" min={minDate} />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-line bg-paper text-sm font-medium text-muted transition-colors hover:border-danger/40 hover:bg-danger/5 hover:text-danger md:w-11"
                  aria-label={`Remove action ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  <span className="md:hidden">Remove action</span>
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>

      {fields.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line px-6 py-10 text-center">
          <ListPlus className="h-6 w-6 text-steel" aria-hidden="true" />
          <p className="font-medium text-navy">No next actions added</p>
          <p className="text-sm text-muted">Add any follow-up actions agreed during the review.</p>
        </div>
      )}

      <button
        type="button"
        onClick={addRow}
        disabled={fields.length >= MAX_ACTIONS}
        className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-royal/30 px-4 py-2.5 text-sm font-semibold text-royal transition-colors hover:border-royal hover:bg-royal hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add action
      </button>
      {fields.length >= MAX_ACTIONS && <p className="mt-2 text-sm text-muted">Maximum of {MAX_ACTIONS} actions.</p>}
    </div>
  )
}
