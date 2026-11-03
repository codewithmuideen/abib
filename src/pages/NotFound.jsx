import { ArrowLeft } from 'lucide-react'
import { company } from '../../shared/company'
import Button from '../components/Button'
import Seo from '../components/Seo'
import SplitText from '../components/SplitText'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" path="/404" description="The page you are looking for could not be found." noindex />
      <section className="px-2 pt-2 sm:px-3 sm:pt-3">
        <div className="relative flex min-h-[80svh] items-center overflow-hidden rounded-[28px] bg-gradient-to-b from-[#D5E2EF] via-[#E6EEF6] to-[#F4F8FC] sm:rounded-[36px]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 bottom-0 select-none font-display text-[38vw] font-extrabold leading-none text-navy/[0.04]"
          >
            404
          </span>
          <div className="container relative pt-[var(--nav-h)]">
            <p className="eyebrow">Error 404</p>
            <SplitText
              lines={['This page could not', { text: 'be found.', className: 'text-royal' }]}
              className="heading-xl mt-6 text-navy"
            />
            <p className="mt-6 max-w-lg text-lg text-muted">
              The page may have moved. Head back to the homepage or call us on{' '}
              <a href={company.phoneHref} className="font-semibold text-navy underline underline-offset-4">
                {company.phone}
              </a>
              .
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button to="/" variant="primary" size="lg" icon={ArrowLeft}>
                Back to home
              </Button>
              <Button to="/contact" variant="outline" size="lg">
                Contact us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
