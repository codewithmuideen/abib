import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, KeyRound, Link2, LoaderCircle, Mail, ShieldCheck } from 'lucide-react'
import { company } from '../../shared/company'
import { formatDate } from '../lib/format'
import { EASE } from '../lib/motion'
import { createReviewLink } from '../services/api'
import Seo from '../components/Seo'

const DURATIONS = [7, 14, 30, 60, 90]

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link:', text)
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-royal"
    >
      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      {copied ? 'Copied' : 'Copy link'}
    </button>
  )
}

const emailHref = (link) => {
  const subject = 'Your First Week Review'
  const body = `Hello ${link.employeeName},\n\nPlease complete your First Week Employee Review using your personal link below. The link is just for you and expires on ${formatDate(link.expiresAt.slice(0, 10))}.\n\n${link.url}\n\nKind regards,\n${company.name}`
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/** Private page (not linked anywhere) where HR creates personal review links. */
export default function ReviewLinks() {
  const [password, setPassword] = useState('')
  const [employeeName, setEmployeeName] = useState('')
  const [days, setDays] = useState(14)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [links, setLinks] = useState([])

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setError('')
    if (employeeName.trim().length < 2) return setError('Enter the employee’s full name.')
    setBusy(true)
    try {
      const link = await createReviewLink({ password, employeeName: employeeName.trim(), days })
      setLinks((l) => [link, ...l])
      setEmployeeName('')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Seo
        title="Review links"
        path="/review-links"
        description="Private page for creating First Week Review links."
        noindex
      />
      <section className="px-2 pt-2 sm:px-3 sm:pt-3">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-[#D5E2EF] via-[#E6EEF6] to-[#F4F8FC] sm:rounded-[36px]">
          <div className="container pb-16 pt-[calc(var(--nav-h)+2.5rem)] md:pt-[calc(var(--nav-h)+3.5rem)]">
            <div className="mx-auto max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-paper/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-navy shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-royal" aria-hidden="true" /> HR only
              </p>
              <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                First Week Review links
              </h1>
              <p className="mt-3 text-lg text-muted">
                Create a personal link for each new employee. Only someone with their link can open the review form, and
                the link stops working after the time you choose.
              </p>

              <form
                onSubmit={submit}
                className="mt-10 space-y-6 rounded-3xl border border-white bg-paper p-6 shadow-card sm:p-8"
                noValidate
              >
                <div>
                  <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-navy">
                    Admin password
                  </label>
                  <div className="relative">
                    <KeyRound
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                      aria-hidden="true"
                    />
                    <input
                      id="admin-password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="field-control pl-11"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-[1fr_180px]">
                  <div>
                    <label htmlFor="employee-name" className="mb-2 block text-sm font-semibold text-navy">
                      Employee full name
                    </label>
                    <input
                      id="employee-name"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      maxLength={120}
                      autoComplete="off"
                      className="field-control"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="valid-days" className="mb-2 block text-sm font-semibold text-navy">
                      Link valid for
                    </label>
                    <select
                      id="valid-days"
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      className="field-control"
                    >
                      {DURATIONS.map((d) => (
                        <option key={d} value={d}>
                          {d} days
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-danger/25 bg-danger/[0.06] p-4 text-sm text-danger"
                  >
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-royal font-display text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-navy disabled:opacity-60"
                >
                  {busy ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Link2 className="h-4 w-4" aria-hidden="true" />
                  )}
                  {busy ? 'Creating link…' : 'Create personal link'}
                </button>
              </form>

              {links.length > 0 && (
                <div className="mt-10 space-y-4" aria-live="polite">
                  <h2 className="font-display text-lg font-bold text-navy">Links created this session</h2>
                  {links.map((link) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="rounded-2xl border border-line bg-paper p-5 shadow-card"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-display font-bold text-navy">{link.employeeName}</p>
                        <p className="text-sm text-muted">Expires {formatDate(link.expiresAt.slice(0, 10))}</p>
                      </div>
                      <p className="mt-3 break-all rounded-xl bg-mist px-4 py-3 font-mono text-xs text-ink">
                        {link.url}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <CopyButton text={link.url} />
                        <a
                          href={emailHref(link)}
                          className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-royal hover:text-royal"
                        >
                          <Mail className="h-4 w-4" aria-hidden="true" /> Email to employee
                        </a>
                      </div>
                    </motion.div>
                  ))}
                  <p className="text-sm text-muted">
                    Links are not stored. Copy or email each one before leaving this page.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
