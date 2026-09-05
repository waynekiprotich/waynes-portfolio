import { Link } from '@/lib/router'
import SEO from '@/components/SEO'
import PageHeader from '@/components/PageHeader'

export default function NotFound() {
  return (
    <>
      <SEO title="Not found" description="This page does not exist." path="/404" />
      <PageHeader
        eyebrow="404"
        title="Page not found"
        lede="The page you asked for is not here. It may have moved, or it may never have existed."
        meta={
          <div className="flex flex-wrap gap-3">
            <Link to="/" className="btn btn-solid">Home</Link>
            <Link to="/work" className="btn btn-ghost">Selected work</Link>
          </div>
        }
      />
      <div className="pb-24" />
    </>
  )
}
