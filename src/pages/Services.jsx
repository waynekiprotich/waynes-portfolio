import SEO from '@/components/SEO'
import PageHeader from '@/components/PageHeader'
import ServicesList from '@/components/Services'
import Process from '@/components/Process'
import ContactCTA from '@/components/ContactCTA'

export default function Services() {
  return (
    <>
      <SEO
        title="Services"
        description="Website development, full-stack applications, e-commerce, APIs, database design, performance and maintenance."
        path="/services"
      />

      <PageHeader
        eyebrow="Services"
        title="What I take on"
        lede="Seven things I do repeatedly and well. Most engagements combine several of them; scope is agreed before anything is built."
      />

      <ServicesList withHeading={false} />
      <Process />
      <ContactCTA />
    </>
  )
}
