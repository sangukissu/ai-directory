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

async function getCategoryInfo(slug: string): Promise<AIToolCategory | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${apiUrl}/api/categories/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
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
  const [category, setCategory] = useState<AIToolCategory | null>(null);

  useEffect(() => {
    const fetchCategoryAndTools = async () => {
      setLoading(true);
      try {
        const categoryInfo = await getCategoryInfo(slug as string);
        setCategory(categoryInfo);

        const data = await getToolsByCategory(slug as string, 20);
        setTools(data.edges.map(edge => edge.node));
        setHasNextPage(data.pageInfo.hasNextPage);
        setEndCursor(data.pageInfo.endCursor);
      } catch (e) {
        console.error('Error loading category or tools:', e);
        setError(e instanceof Error ? e : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndTools();
  }, [slug]);

  const loadMoreTools = async () => {
    setLoading(true);
    try {
      const data = await getToolsByCategory(slug as string, 20, endCursor);
      setTools(prevTools => [...prevTools, ...data.edges.map(edge => edge.node)]);
      setHasNextPage(data.pageInfo.hasNextPage);
      setEndCursor(data.pageInfo.endCursor);
    } catch (e) {
      console.error('Error loading more tools:', e);
      setError(e instanceof Error ? e : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const generateDescription = (category: AIToolCategory | null, toolCount: number): string => {
    if (!category) {
      return `Explore AI tools in this category on Geekdroid. Find and compare top artificial intelligence solutions.`;
    }

    const descriptions = [
      `Discover ${toolCount}+ cutting-edge ${category.name} AI tools on Geekdroid. Enhance your workflow with top-rated artificial intelligence solutions.`,
      `Explore a curated collection of ${toolCount}+ ${category.name} AI tools. Find the perfect AI solution to streamline your tasks and boost productivity.`,
      `Browse our selection of ${toolCount}+ innovative ${category.name} AI tools. Compare features and find the ideal AI solution for your needs.`
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const pageTitle = category ? `${category.name} AI Tools | Geekdroid` : 'AI Tools Category | Geekdroid';
  const pageDescription = generateDescription(category, tools.length);

  if (error) {
    return (
      <ApolloWrapper>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
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
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>
      <div className="min-h-screen bg-black">
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <nav className="flex items-center space-x-2 text-sm mb-4 bg-[#0d1117] rounded-xl border border-[#1d2433] px-4 py-2">
            <Link href="/" className="text-gray-400 hover:text-white">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-white">{category?.name || 'Category'}</span>
          </nav>
          
          <div className="mx-auto bg-[#0d1117] rounded-2xl border border-[#1d2433] p-5">
            <h1 className="text-3xl font-bold text-white mb-8">{category?.name || 'Category'} AI Tools</h1>
            
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
                      category={tool.aiToolCategories.nodes[0]?.name || category?.name || 'AI Tool'}
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
                      onClick={loadMoreTools}
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

