import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from '@/theme/ThemeProvider'
import RootLayout from '@/layouts/RootLayout'
import RouteFallback from '@/components/RouteFallback'

const Home = lazy(() => import('@/pages/Home'))
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
          <Routes>
            {/* `/*` — a bare "/" would match only the root and leave every
                other URL with nothing rendered at all. */}
            <Route
              path="/*"
              element={
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
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </RootLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  )
}
