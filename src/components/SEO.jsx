import { Helmet } from 'react-helmet-async'
import { SITE } from '@/data/site'

export default function SEO({
  title,
  description,
  path = '',
  type = 'website',
  image = `${SITE.url}/og-image.png`,
  schema,
}) {
  const defaultTitle = `${SITE.name} | ${SITE.role}`
  const defaultDesc = `${SITE.name} is a full-stack software engineer in ${SITE.location}, building modern web applications for real-world use.`

  const metaTitle = title ? `${title} — ${SITE.name}` : defaultTitle
  const metaDesc = description || defaultDesc
  const fullUrl = `${SITE.url}${path}`

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE.name} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={image} />

      {schema && (
        <script type="application/ld+json">
          {typeof schema === 'string' ? schema : JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  )
}
