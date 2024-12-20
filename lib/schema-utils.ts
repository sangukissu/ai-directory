import { AITool } from '@/types/aiTool'

export function generateToolSchema(tool: AITool, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.title,
    "description": tool.excerpt.replace(/<[^>]*>/g, ''),
    "url": url,
    "applicationCategory": "AI Tool",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "image": tool.featuredImage?.node?.sourceUrl || "",
    "dateModified": tool.modifiedGmt
  }
}

