import SEO from '@/components/SEO'
import Hero from '@/components/Hero'
import Statement from '@/components/Statement'
import SelectedWork from '@/components/work/SelectedWork'
import Capabilities from '@/components/Capabilities'
import Services from '@/components/Services'
import Process from '@/components/Process'
import AboutPreview from '@/components/AboutPreview'
import JournalPreview from '@/components/JournalPreview'
import ContactCTA from '@/components/ContactCTA'
import { SITE } from '@/data/site'

export default function Home() {
  return (
    <>
      <SEO
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: SITE.name,
          jobTitle: SITE.role,
          url: SITE.url,
          address: { '@type': 'PostalAddress', addressLocality: 'Nairobi', addressCountry: 'KE' },
          sameAs: [SITE.github, SITE.linkedin],
        }}
      />
      <Hero />
      <Statement />
      <SelectedWork />
      <Capabilities />
      <Services limit={4} />
      <Process />
      <AboutPreview />
      <JournalPreview />
      <ContactCTA />
    </>
  )
}
