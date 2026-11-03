import { company } from '../../shared/company.js'

const COLORS = { navy: '#0E2646', royal: '#1766C1', sky: '#229BD8', line: '#E3EAF3', muted: '#5A6A7F', mist: '#F4F7FB' }

export const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

// Strip control characters (other than tab/newline) from user input.
// oxlint-disable-next-line no-control-regex
export const clean = (value) => String(value ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')

const display = (value) => {
  const v = clean(value).trim()
  return v === '' ? 'Not provided' : v
}

const htmlValue = (value) => escapeHtml(display(value)).replace(/\n/g, '<br>')

export const formatDate = (iso) => {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/**
 * Builds matching HTML and plain-text emails.
 *
 * sections: [{ heading, rows?: [[label, value]], table?: { columns: [], rows: [[]] , empty } }]
 */
export function renderEmail({ title, intro, sections }) {
  const htmlSections = sections
    .map(({ heading, rows, table }) => {
      let body = ''
      if (rows) {
        body = rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid ${COLORS.line};width:40%;vertical-align:top;color:${COLORS.muted};font-size:13px;">${escapeHtml(label)}</td>
            <td style="padding:10px 0 10px 16px;border-bottom:1px solid ${COLORS.line};vertical-align:top;color:${COLORS.navy};font-size:14px;">${htmlValue(value)}</td>
          </tr>`,
          )
          .join('')
        body = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${body}</table>`
      }
      if (table) {
        const head = table.columns
          .map(
            (c) =>
              `<th align="left" style="padding:8px;background:${COLORS.mist};color:${COLORS.navy};font-size:12px;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid ${COLORS.line};">${escapeHtml(c)}</th>`,
          )
          .join('')
        const bodyRows = table.rows.length
          ? table.rows
              .map(
                (r) =>
                  `<tr>${r.map((cell) => `<td style="padding:8px;border-bottom:1px solid ${COLORS.line};font-size:14px;color:${COLORS.navy};vertical-align:top;">${htmlValue(cell)}</td>`).join('')}</tr>`,
              )
              .join('')
          : `<tr><td colspan="${table.columns.length}" style="padding:10px 8px;color:${COLORS.muted};font-size:14px;">${escapeHtml(table.empty)}</td></tr>`
        body = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><thead><tr>${head}</tr></thead><tbody>${bodyRows}</tbody></table>`
      }
      return `
        <tr><td style="padding:28px 32px 0;">
          <h2 style="margin:0 0 8px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:${COLORS.royal};">${escapeHtml(heading)}</h2>
          ${body}
        </td></tr>`
    })
    .join('')

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:24px 12px;background:${COLORS.mist};font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;margin:0 auto;background:#ffffff;border-collapse:collapse;">
    <tr><td style="background:${COLORS.navy};padding:28px 32px;border-bottom:4px solid ${COLORS.sky};">
      <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:${COLORS.sky};">${escapeHtml(company.name)}</div>
      <h1 style="margin:8px 0 0;font-size:22px;color:#ffffff;">${escapeHtml(title)}</h1>
    </td></tr>
    ${intro ? `<tr><td style="padding:24px 32px 0;color:${COLORS.muted};font-size:14px;line-height:1.6;">${escapeHtml(intro)}</td></tr>` : ''}
    ${htmlSections}
    <tr><td style="padding:32px;color:${COLORS.muted};font-size:12px;line-height:1.6;">
      Sent from the website form at ${escapeHtml(company.website)} on ${escapeHtml(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }))} (UK time).
    </td></tr>
  </table>
</body></html>`

  const textSections = sections
    .map(({ heading, rows, table }) => {
      const lines = [`\n${heading.toUpperCase()}\n${'-'.repeat(heading.length)}`]
      if (rows) rows.forEach(([label, value]) => lines.push(`${label}: ${display(value)}`))
      if (table) {
        if (!table.rows.length) lines.push(table.empty)
        table.rows.forEach((r, i) =>
          lines.push(`${i + 1}. ${table.columns.map((c, j) => `${c}: ${display(r[j])}`).join(' | ')}`),
        )
      }
      return lines.join('\n')
    })
    .join('\n')

  const text = `${title}\n${company.name}\n${intro ? `\n${intro}\n` : ''}${textSections}\n\nSent from the website form at ${company.website}.`

  return { html, text }
}
