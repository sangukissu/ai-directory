'use client'

import { useState, useEffect } from 'react'
import { ToolCard } from "@/components/tool-card"
import ApolloWrapper from '@/components/ApolloWrapper'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import TryAgainButton from '@/components/TryAgainButton'
import SubmitToolButton from '@/components/SubmitToolButton'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Head from 'next/head'
import { generateCategoryMetadata, generateCategorySchema } from '@/lib/seo-utils'

interface AIToolCategory {
  name: string;
  slug: string;
}

interface AITool {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  aiToolCategories: {
    nodes: AIToolCategory[];
  };
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  };
}

interface AIToolEdge {
  node: AITool;
}

interface AIToolsResponse {
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
  edges: AIToolEdge[];
}

async function getToolsByCategory(categorySlug: string, first: number = 20, after: string | null = null): Promise<AIToolsResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const url = new URL(`${apiUrl}/api/ai-tools`);
  url.searchParams.append('first', first.toString());
  url.searchParams.append('category', categorySlug);
  if (after) url.searchParams.append('after', after);

  const res = await fetch(url.toString(), { 
    cache: 'no-store',
    next: { revalidate: 0 }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch AI Tools: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export default function CategoryPage() {
  const { slug } = useParams();
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState(slug as string);
  const [categoryDescription, setCategoryDescription] = useState('');

  const loadTools = async (isInitial: boolean = false) => {
    setLoading(true);
    try {
      const data = await getToolsByCategory(slug as string, 20, isInitial ? null : endCursor);
      setTools(prevTools => isInitial ? data.edges.map(edge => edge.node) : [...prevTools, ...data.edges.map(edge => edge.node)]);
      setHasNextPage(data.pageInfo.hasNextPage);
      setEndCursor(data.pageInfo.endCursor);
      if (isInitial && data.edges.length > 0) {
        const category = data.edges[0].node.aiToolCategories.nodes[0];
        setCategoryName(category?.name || slug as string);
        setCategoryDescription(`Explore the best ${category?.name || slug as string} AI tools on Geekdroid.`);
      }
    } catch (e) {
      console.error('Error loading tools:', e);
      setError(e instanceof Error ? e : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTools(true);
  }, [slug]);

  const metadata = generateCategoryMetadata({
    categoryName,
    categoryDescription,
    categorySlug: slug as string,
  });

  const schema = generateCategorySchema(
    categoryName,
    categoryDescription,
    `https://geekdroid.in/category/${slug}`
  );

  if (error) {
    return (
      <ApolloWrapper>
        <Head>
          <title>{metadata.title as string}</title>
          <meta name="description" content={metadata.description as string} />
          <meta property="og:title" content={metadata.openGraph?.title as string} />
          <meta property="og:description" content={metadata.openGraph?.description as string} />
          <meta property="og:url" content={metadata.openGraph?.url as string} />
          <meta property="og:site_name" content={metadata.openGraph?.siteName as string} />
          <meta property="og:image" content={
            Array.isArray(metadata.openGraph?.images) 
              ? metadata.openGraph.images[0]?.url 
              : typeof metadata.openGraph?.images === 'object' 
                ? metadata.openGraph.images.url 
                : ''
          } />
          <meta name="twitter:card" content={metadata.twitter?.card as string} />
          <meta name="twitter:title" content={metadata.twitter?.title as string} />
          <meta name="twitter:description" content={metadata.twitter?.description as string} />
          <meta name="twitter:image" content={
            Array.isArray(metadata.openGraph?.images) 
              ? metadata.openGraph.images[0]?.url 
              : typeof metadata.openGraph?.images === 'object' 
                ? metadata.openGraph.images.url 
                : ''
          } />
          <link rel="canonical" href={metadata.alternates?.canonical as string} />
          <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Head>
        <div className="min-h-screen bg-black">
          <main className="container mx-auto px-4 py-8 max-w-7xl">
            <Alert variant="destructive" className="bg-red-900 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading AI Tools</AlertTitle>
              <AlertDescription>
                We're sorry, but there was an error loading the AI tools. Please try again later.
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-2 text-sm opacity-75">
                    Error details: {error.message}
                  </div>
                )}
              </AlertDescription>
              <TryAgainButton />
            </Alert>
          </main>
        </div>
      </ApolloWrapper>
    );
  }

  return (
    <ApolloWrapper>
      <Head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
        <meta property="og:title" content={metadata.openGraph?.title as string} />
        <meta property="og:description" content={metadata.openGraph?.description as string} />
        <meta property="og:url" content={metadata.openGraph?.url as string} />
        <meta property="og:site_name" content={metadata.openGraph?.siteName as string} />
        <meta property="og:image" content={
          Array.isArray(metadata.openGraph?.images) 
            ? metadata.openGraph.images[0]?.url 
            : typeof metadata.openGraph?.images === 'object' 
              ? metadata.openGraph.images.url 
              : ''
        } />
        <meta name="twitter:card" content={metadata.twitter?.card as string} />
        <meta name="twitter:title" content={metadata.twitter?.title as string} />
        <meta name="twitter:description" content={metadata.twitter?.description as string} />
        <meta name="twitter:image" content={
          Array.isArray(metadata.openGraph?.images) 
            ? metadata.openGraph.images[0]?.url 
            : typeof metadata.openGraph?.images === 'object' 
              ? metadata.openGraph.images.url 
              : ''
        } />
        <link rel="canonical" href={metadata.alternates?.canonical as string} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Head>
      <div className="min-h-screen bg-black">
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <nav className="flex items-center space-x-2 text-sm mb-4 bg-[#0d1117] rounded-xl border border-[#1d2433] px-4 py-2">
            <Link href="/" className="text-gray-400 hover:text-white">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-white">{categoryName}</span>
          </nav>
          
          <div className="mx-auto bg-[#0d1117] rounded-2xl border border-[#1d2433] p-5">
            <h1 className="text-3xl font-bold text-white mb-8">{categoryName} AI Tools</h1>
            
            {tools.length === 0 && !loading ? (
              <Alert className="bg-yellow-900 border-yellow-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No AI Tools Found</AlertTitle>
                <AlertDescription>
                  No AI tools are currently available in this category. Please check back later or submit your own tool.
                </AlertDescription>
                <SubmitToolButton />
              </Alert>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {tools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      title={tool.title}
                      category={tool.aiToolCategories.nodes[0]?.name || categoryName}
                      slug={tool.slug}
                      previewImage={tool.featuredImage?.node?.sourceUrl || "/placeholder.svg"}
                      logo={tool.featuredImage?.node?.sourceUrl || "/placeholder.svg"}
                      isVerified={Math.random() > 0.5}
                    />
                  ))}
                </div>
                {hasNextPage && (
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={() => loadTools()}
                      disabled={loading}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </ApolloWrapper>
  );
}

