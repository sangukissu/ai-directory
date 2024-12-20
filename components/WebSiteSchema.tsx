import React from 'react'
import { generateWebSiteSchema } from '@/lib/seo-utils'

export function WebSiteSchema(): JSX.Element {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateWebSiteSchema())
      }}
    />
  )
}

