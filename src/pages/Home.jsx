import Seo from '../components/Seo'
import Approach from '../sections/Approach'
import ContactSection from '../sections/ContactSection'
import CtaBand from '../sections/CtaBand'
import Hero from '../sections/Hero'
import Intro from '../sections/Intro'
import Portfolio from '../sections/Portfolio'
import ServicesGrid from '../sections/ServicesGrid'
import WhyChoose from '../sections/WhyChoose'

export default function Home() {
  return (
    <>
      <Seo
        path="/"
        description="Abib Plumbing & Building Management Ltd provides professional plumbing and building management solutions from Barking, London. Call 020 3488 4332 or request a quote online."
      />
      <Hero />
      <Intro />
      <ServicesGrid />
      <WhyChoose />
      <Approach />
      <Portfolio />
      <CtaBand />
      <ContactSection />
    </>
  )
}
