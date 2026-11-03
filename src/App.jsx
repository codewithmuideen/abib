import { Suspense, lazy, useEffect, useRef } from 'react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { EASE } from './lib/motion'
import Home from './pages/Home'

// Inner pages are split into separate chunks and prefetched once the browser is idle.
const pages = {
  About: () => import('./pages/About'),
  Services: () => import('./pages/Services'),
  OurApproach: () => import('./pages/OurApproach'),
  Contact: () => import('./pages/Contact'),
  RequestQuote: () => import('./pages/RequestQuote'),
  Blog: () => import('./pages/Blog'),
  FirstWeekReview: () => import('./pages/FirstWeekReview'),
  PrivacyPolicy: () => import('./pages/PrivacyPolicy'),
  NotFound: () => import('./pages/NotFound'),
}
const About = lazy(pages.About)
const Services = lazy(pages.Services)
const OurApproach = lazy(pages.OurApproach)
const Contact = lazy(pages.Contact)
const RequestQuote = lazy(pages.RequestQuote)
const Blog = lazy(pages.Blog)
const FirstWeekReview = lazy(pages.FirstWeekReview)
const PrivacyPolicy = lazy(pages.PrivacyPolicy)
const NotFound = lazy(pages.NotFound)

function PageFallback() {
  return <div className="min-h-[100svh]" aria-busy="true" />
}

/** Scrolls to #hash targets once the incoming page has rendered, or to the top on same-page re-navigation. */
function useScrollHandling() {
  const { pathname, hash, key } = useLocation()
  const reduce = useReducedMotion()
  const lastPath = useRef(pathname)

  useEffect(() => {
    const samePage = lastPath.current === pathname
    lastPath.current = pathname
    const behavior = reduce ? 'auto' : 'smooth'

    if (!hash) {
      if (samePage) window.scrollTo({ top: 0, behavior })
      return
    }

    let frame
    let tries = 0
    const find = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) el.scrollIntoView({ behavior, block: 'start' })
      else if (tries++ < 90) frame = requestAnimationFrame(find)
    }
    find()
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash, key, reduce])
}

function Layout() {
  const location = useLocation()
  useScrollHandling()

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1500))
    idle(() => Object.values(pages).forEach((load) => load()))
  }, [])

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait" onExitComplete={() => !location.hash && window.scrollTo(0, 0)}>
        <motion.main
          id="main"
          key={location.pathname}
          tabIndex={-1}
          className="outline-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, ease: EASE } }}
          exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }}
        >
          <Suspense fallback={<PageFallback />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/our-approach" element={<OurApproach />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/request-a-quote" element={<RequestQuote />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/careers" element={<Navigate to="/blog" replace />} />
              <Route path="/first-week-review" element={<FirstWeekReview />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </MotionConfig>
  )
}
