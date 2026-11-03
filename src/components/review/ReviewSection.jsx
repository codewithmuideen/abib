import { CircleCheck } from 'lucide-react'

export default function ReviewSection({ number, title, description, status, children }) {
  const id = `review-section-${number}`
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-line bg-paper shadow-card"
    >
      <header className="flex items-start gap-4 border-b border-line bg-gradient-to-r from-mist to-paper px-5 py-5 sm:px-8 sm:py-6">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-navy font-display text-sm font-bold text-white">
          {String(number).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-royal">Section {number}</p>
          <h2 id={`${id}-title`} className="mt-0.5 font-display text-lg font-bold tracking-tight text-navy sm:text-xl">
            {title}
          </h2>
          {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        </div>
        {status === 'done' && <CircleCheck className="mt-1 h-6 w-6 shrink-0 text-success" aria-label="Section complete" />}
      </header>
      <div className="space-y-7 px-5 py-7 sm:px-8 sm:py-8">{children}</div>
    </section>
  )
}
