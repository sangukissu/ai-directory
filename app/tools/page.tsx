import { Suspense } from 'react'
import { Metadata } from 'next'
import { ToolsGrid } from '@/components/ToolsGrid'
import { ToolsHeader } from '@/components/ToolsHeader'
import { generateMetadata, generateWebPageSchema } from '@/lib/seo-utils'

export const metadata: Metadata = generateMetadata({
  title: "AI Tools Directory | Geekdroid",
  description: "Explore our comprehensive directory of AI tools to enhance your workflow and boost productivity.",
  canonical: "https://geekdroid.in/tools"
})

export default function ToolsPage() {
  const webPageSchema = generateWebPageSchema(
    "AI Tools Directory",
    "Explore our comprehensive directory of AI tools to enhance your workflow and boost productivity.",
    "https://geekdroid.in/tools"
  )

  return (
    <div className="min-h-screen bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <ToolsHeader />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Suspense fallback={<div className="text-white">Loading AI Tools...</div>}>
          <ToolsGrid />
        </Suspense>
      </main>
    </div>
  )
}

