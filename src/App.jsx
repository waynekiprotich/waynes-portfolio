import { lazy, Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Routes, Route } from '@/lib/router'
import { ThemeProvider } from '@/theme/ThemeProvider'
import RootLayout from '@/layouts/RootLayout'
import RouteFallback from '@/components/RouteFallback'
import Home from '@/pages/Home'

// Home is imported eagerly, not lazily: it is the landing route, so splitting
// it only buys a second network round trip before anything can paint — the
// bundle has to load, then ask for the chunk, then render. Every other route
// is one a visitor navigates *to*, by which point the fetch is free.
const Work = lazy(() => import('@/pages/Work'))
const CaseStudy = lazy(() => import('@/pages/CaseStudy'))
const About = lazy(() => import('@/pages/About'))
const Services = lazy(() => import('@/pages/Services'))
const Estimator = lazy(() => import('@/pages/Estimator'))
const Journal = lazy(() => import('@/pages/Journal'))
const CV = lazy(() => import('@/pages/CV'))
const Contact = lazy(() => import('@/pages/Contact'))
const NotFound = lazy(() => import('@/pages/NotFound'))

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <RootLayout>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/work" element={<Work />} />
                <Route path="/work/:slug" element={<CaseStudy />} />
                {/* Legacy paths from the previous site keep working. */}
                <Route path="/projects" element={<Work />} />
                <Route path="/projects/:slug" element={<CaseStudy />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/estimator" element={<Estimator />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/blog" element={<Journal />} />
                <Route path="/cv" element={<CV />} />
                <Route path="/contact" element={<Contact />} />
                {/* Last: Routes takes the first match in source order. */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </RootLayout>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  )
}
