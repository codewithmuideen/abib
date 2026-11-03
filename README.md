# Abib Plumbing & Building Management Ltd: Website

Corporate website and form email API for [www.abibltd.co.uk](https://www.abibltd.co.uk).

- **Frontend:** React 19, Vite, Tailwind CSS, React Router, Framer Motion, Lucide icons
- **Forms:** React Hook Form + Zod (the same schemas validate in the browser and on the server)
- **Backend:** Node.js / Express, sending every form submission by email through [Resend](https://resend.com)

## Pages

| Route                | Page                                                         |
| -------------------- | ------------------------------------------------------------ |
| `/`                  | Home                                                         |
| `/about`             | About Us                                                     |
| `/services`          | Services (each service has an anchor, e.g. `#plumbing-services`) |
| `/our-approach`      | Our Approach: four-step process infographic                  |
| `/request-a-quote`   | Quote request form (`?service=` pre-selects a service)       |
| `/contact`           | Contact details, form and map                                |
| `/careers`           | Careers application form with optional CV upload             |
| `/first-week-review` | Internal HR First Week Employee Review form (not indexed)    |
| `/privacy-policy`    | Privacy Policy                                               |

## Forms and where they are sent

| Form              | Endpoint                      | Sent to             |
| ----------------- | ----------------------------- | ------------------- |
| Contact           | `POST /api/contact`           | `CONTACT_EMAIL`     |
| Request a quote   | `POST /api/quote`             | `CONTACT_EMAIL`     |
| Careers (+ CV)    | `POST /api/careers`           | `HR_EMAIL`          |
| First week review | `POST /api/first-week-review` | `HR_EMAIL`          |

Every submission is validated on the server, escaped and sent as an HTML email with a plain-text alternative.
Contact, quote and careers emails set **Reply-To** to the sender, so staff can simply reply. The visitor only sees a
success message after Resend has accepted the email; otherwise they see an error and the contact details.

Protection built in: server-side validation and length limits, HTML escaping, a hidden honeypot field, per-form rate
limiting (6 successful submissions per 10 minutes per IP), a 100 KB JSON body limit, and CV uploads restricted to
PDF / DOC / DOCX up to 5 MB with file-signature checks. CVs are attached to the email and never written to disk.

## Getting started

Requires Node.js 20.11 or newer.

```bash
npm install
cp .env.example .env     # then fill in the values (see below)
npm run dev              # API on :3001 and Vite on :5173 (proxying /api)
```

Open http://localhost:5173.

## Environment variables

| Variable            | Required | Description                                                                 |
| ------------------- | -------- | --------------------------------------------------------------------------- |
| `RESEND_API_KEY`    | Yes      | Resend API key. Server-side only, never commit it.                          |
| `RESEND_FROM_EMAIL` | Yes      | Sender on a verified domain, e.g. `Abib Website <website@abibltd.co.uk>`    |
| `CONTACT_EMAIL`     | No       | Defaults to `info@abibltd.co.uk`                                            |
| `HR_EMAIL`          | No       | Defaults to `hr@abibltd.co.uk`                                              |
| `PORT`              | No       | Defaults to `3001`                                                          |
| `TRUST_PROXY`       | No       | Number of reverse proxies in front of Node (usually `1` in production)      |

Without `RESEND_API_KEY` and `RESEND_FROM_EMAIL` the site still runs, but forms return **503** with a message asking the
visitor to call or email. Nothing is silently discarded and no false success is shown. `GET /api/health` reports
whether email is configured.

## Setting up Resend (required before forms deliver email)

1. Create an account at resend.com and add the domain **abibltd.co.uk** under *Domains*.
2. Add the DNS records Resend shows (SPF/MX and DKIM `TXT`/`CNAME` records) at the domain's DNS provider. A DMARC
   record is also recommended.
3. Wait until the domain shows **Verified** in Resend. Until then Resend will only send to the account owner's address.
4. Create an API key with *Sending access* and set it as `RESEND_API_KEY`.
5. Set `RESEND_FROM_EMAIL` to an address on the verified domain, e.g. `Abib Website <website@abibltd.co.uk>`.
6. Submit each form once and confirm the emails arrive at info@ and hr@.

## Production build and deployment

```bash
npm run build    # builds the site into dist/
npm start        # serves dist/ and the /api routes from one Node process on $PORT
```

Deploy to any host that runs Node.js (a VPS with Nginx, Render, Railway, Fly.io and so on):

- Build command `npm install && npm run build`, start command `npm start`.
- Set the environment variables in the host's dashboard. Do not upload `.env`.
- Behind a proxy or load balancer, set `TRUST_PROXY=1`.
- Serve over HTTPS on `www.abibltd.co.uk` and redirect the bare domain to it.

The server sends security headers (Helmet, including a Content Security Policy), caches hashed assets for a year, and
returns a real 404 status for unknown URLs.

## Project structure

```
public/
  favicon/              favicons + manifest icons
  images/brand/         original logo files (unchanged)
  images/logo/          trimmed web copies of the logos
  images/photos/        locally hosted photography (WebP)
  images/og-image.jpg   social sharing image
  robots.txt, sitemap.xml, site.webmanifest
shared/
  company.js            verified company details (used by site and emails)
  schemas.js            Zod validation shared by browser and server
server/
  index.js              Express app, security, rate limits, static hosting
  lib/                  form handler + email template
  routes/               one handler per form
  services/emailService.js   Resend wrapper
src/
  components/           UI building blocks (Navbar, Footer, Button, form fields, review form parts)
  sections/             homepage sections
  pages/                one file per route
  data/                 services, values, approach steps, image references
  services/api.js       fetch client for the API
  styles/index.css      brand colour tokens and global styles
```

## Brand

Colours were sampled directly from the supplied logo artwork and are defined once as CSS variables in
`src/styles/index.css`:

| Token   | HEX       | Use                                   |
| ------- | --------- | ------------------------------------- |
| Navy    | `#0E2646` | Primary: text, dark sections          |
| Royal   | `#1766C1` | Secondary: buttons, links, highlights |
| Sky     | `#229BD8` | Accent: details, focus states         |
| Mist    | `#F4F7FB` | Light section backgrounds             |
| Line    | `#E3EAF3` | Borders and dividers                  |
| Muted   | `#5A6A7F` | Secondary text                        |

Headings use Montserrat (matching the logo wordmark) and body text uses Inter. Both are self-hosted, so the site makes
no font requests to Google.

## Content still needed from Abib

- **Project photography.** The "Our Work" section uses illustrative stock imagery that is labelled as such. Replace
  `src/data/content.js > portfolio` with real project photos when available.
- **Privacy policy review.** `src/pages/PrivacyPolicy.jsx` describes how this website handles data. Abib should confirm
  retention periods and its own data-protection obligations (for example ICO registration) before launch.
- **Social media.** No social profiles are linked. Add them to the footer once genuine URLs are supplied.
- Photography is from Unsplash (free to use under the Unsplash licence).
