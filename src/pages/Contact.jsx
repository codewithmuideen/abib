import { Phone } from 'lucide-react'
import { company } from '../../shared/company'
import { images } from '../data/content'
import Button from '../components/Button'
import PageHero from '../components/PageHero'
import Seo from '../components/Seo'
import ContactSection from '../sections/ContactSection'

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact Us"
        path="/contact"
        description="Contact Abib Plumbing & Building Management Ltd, 160 Jhumat House, London Road, Barking IG11 8BB. Telephone 020 3488 4332 or email info@abibltd.co.uk."
      />
      <PageHero
        crumb="Contact"
        eyebrow="Contact Us"
        title={['Let’s talk about', { text: 'your property.', className: 'text-sky' }]}
        intro="Whether you have a question, a project in mind or need to arrange work, our team is here to help."
        image={images.contact}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={company.phoneHref} variant="accent" size="lg" icon={Phone}>
            {company.phone}
          </Button>
          <Button to="/request-a-quote" variant="outline-light" size="lg">
            Request a quote
          </Button>
        </div>
      </PageHero>
      <ContactSection showHeading={false} />
    </>
  )
}
