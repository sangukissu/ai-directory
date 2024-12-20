import { ExternalLink, ChevronRight, CheckCircle2 } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { notFound } from 'next/navigation'
import { ToolSidebar } from '@/components/tool-sidebar'
import { PromoteTool } from "@/components/promote-tool"
import { AdSense } from '@/components/AdSense'
import { adsenseConfig } from '@/lib/adsense-config'
import { generateToolSchema } from '@/lib/schema-utils'
import { Metadata } from 'next'
import { AITool, AIToolCategory } from '@/types/aiTool'

interface AIToolCategory {
  name: string;
  slug: string;
}

async function getAITool(slug: string): Promise<AITool | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(
    `${apiUrl}/api/ai-tools/${slug}`, 
    { cache: 'no-store' }
  )
  if (!res.ok) {
    return null
  }
  return res.json()
}

async function getRelatedTools(category: string, currentToolSlug: string): Promise<AITool[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(
    `${apiUrl}/api/ai-tools?first=100&category=${encodeURIComponent(category)}`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch AI Tools: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data.edges
    .map((edge: { node: AITool }) => edge.node)
    .filter((tool: AITool) => tool.slug !== currentToolSlug)
    .slice(0, 3);
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tool = await getAITool(params.slug)
  
  if (!tool) {
    return {}
  }

  const cleanDescription = tool.excerpt.replace(/<[^>]*>/g, "")
  const toolUrl = `https://geekdroid.in/tool/${tool.slug}`

  return {
    title: tool.title,
    description: cleanDescription,
    openGraph: {
      title: tool.title,
      description: cleanDescription,
      url: toolUrl,
      images: [{ url: tool.featuredImage?.node?.sourceUrl || "" }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.title,
      description: cleanDescription,
      images: [tool.featuredImage?.node?.sourceUrl || ""],
    },
  }
}

export default async function ToolPage({ params }: { params: { slug: string } }) {
  const tool = await getAITool(params.slug)

  if (!tool) {
    notFound()
  }

  const category = tool.aiToolCategories.nodes[0]?.slug
  const relatedTools = category ? await getRelatedTools(category, tool.slug) : []

  const toolUrl = `https://geekdroid.in/tool/${tool.slug}`
  const toolSchema = generateToolSchema(tool, toolUrl)

  const formatContent = (content: string) => {
    const sections = content.split(/(?=<h[1-6])/);

    return sections.map((section, index) => {
      if (section.includes('<ul>')) {
        const listItems = section.match(/<li>(.*?)<\/li>/g);
        if (listItems) {
          return (
            <div key={index}>
              <ul className="space-y-4 my-4 list-none">
                {listItems.map((item, i) => {
                  const content = item.replace(/<li>|<\/li>/g, '');
                  return (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-[#24cc90] mr-3 mt-0.5 flex-shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: content }} />
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        }
      }

      const formattedSection = section
        .replace(/<h2>/g, '<h2 className="text-2xl font-bold text-white mt-8 mb-4">')
        .replace(/<h3>/g, '<h3 className="text-xl font-semibold text-white mt-6 mb-3">')
        .replace(/<p>/g, '<p className="text-gray-300 mb-4">');

      return <div key={index} dangerouslySetInnerHTML={{ __html: formattedSection }} />;
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Recently updated';
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <nav className="flex items-center space-x-2 text-sm mb-4 bg-[#0d1117] rounded-xl border border-[#1d2433] px-4 py-2">
          <Link href="/" className="text-gray-400 hover:text-white">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          {tool.aiToolCategories && tool.aiToolCategories.nodes && tool.aiToolCategories.nodes[0] && (
            <>
              <Link href={`/category/${tool.aiToolCategories.nodes[0].slug}`} className="text-gray-400 hover:text-white">
                {tool.aiToolCategories.nodes[0].name}
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </>
          )}
          <span className="text-white">{tool.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-[#0d1117] rounded-2xl border border-[#1d2433] p-5">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{tool.title}</h1>
                {tool.aiToolCategories && tool.aiToolCategories.nodes && tool.aiToolCategories.nodes[0] && (
                  <Link 
                    href={`/category/${tool.aiToolCategories.nodes[0].slug}`}
                    className="inline-block text-white text-sm font-semibold px-3 py-1 rounded-md transition-colors mb-6 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90"
                  >
                    {tool.aiToolCategories.nodes[0].name}
                  </Link>
                )}

                {tool.excerpt && (
                  <div 
                    className="text-gray-300 mb-8 text-lg leading-relaxed" 
                    dangerouslySetInnerHTML={{ __html: tool.excerpt.replace(/<a\s+[^>]*>Read more<\/a>/i, '').trim() }} 
                  />
                )}

                {tool.affiliateLink ? (
                  <Link 
                    href={tool.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-white shadow hover:bg-primary/90 h-9 px-4 py-2"
                  >
                    Explore Website
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                ) : (
                  <span className="text-gray-400">No affiliate link available</span>
                )}
              </div>

              {tool.featuredImage && tool.featuredImage.node && tool.featuredImage.node.sourceUrl && (
                <div className="mb-8 overflow-hidden rounded-xl">
                  <Image
                    src={tool.featuredImage.node.sourceUrl}
                    alt={`${tool.title} Preview`}
                    width={800}
                    height={600}
                    className="w-full"
                  />
                </div>
              )}

              {tool.content && (
                <div className="prose prose-invert max-w-none">
                  {formatContent(tool.content)}
                </div>
              )}

              {tool.modifiedGmt && (
                <p className="text-sm text-gray-400 mt-8">
                  Last updated: {formatDate(tool.modifiedGmt)}
                </p>
              )}
            </div>

            <AdSense slot={adsenseConfig.slots.responsive.toolPage} />

            <PromoteTool toolName={tool.title} toolSlug={tool.slug} />
          </div>

          <div className="lg:col-span-1">
            <ToolSidebar 
              toolName={tool.title} 
              toolSlug={tool.slug}
              relatedTools={relatedTools}
            />
          </div>
        </div>
      </main>
      </div>
    </>
  )
}

