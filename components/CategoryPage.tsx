  'use client'

  import { useState, useEffect } from 'react'
  import { ToolCard } from "@/components/tool-card"
  import { AlertCircle } from 'lucide-react'
  import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
  import TryAgainButton from '@/components/TryAgainButton'
  import SubmitToolButton from '@/components/SubmitToolButton'
  import { Button } from "@/components/ui/button"

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
    toolUrl: string;
    pricingModel: string;
    rating: number;
    affiliateLink: string;
  }

  interface AIToolsResponse {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    edges: {
      node: AITool;
    }[];
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
      const errorText = await res.text();
      throw new Error(`Failed to fetch AI Tools: ${res.status} ${res.statusText}\nResponse: ${errorText}`);
    }

    return res.json();
  }

  export function CategoryPage({ slug, initialCategoryName }: { slug: string, initialCategoryName: string }) {
    const [tools, setTools] = useState<AITool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [endCursor, setEndCursor] = useState<string | null>(null);
    const [categoryName, setCategoryName] = useState(initialCategoryName);

    const loadTools = async (isInitial: boolean = false) => {
      setLoading(true);
      try {
        const data = await getToolsByCategory(slug, 20, isInitial ? null : endCursor);
        setTools(prevTools => isInitial ? data.edges.map(edge => edge.node) : [...prevTools, ...data.edges.map(edge => edge.node)]);
        setHasNextPage(data.pageInfo.hasNextPage);
        setEndCursor(data.pageInfo.endCursor);
        if (isInitial && data.edges.length > 0) {
          setCategoryName(data.edges[0].node.aiToolCategories.nodes[0]?.name || initialCategoryName);
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

    if (error) {
      return (
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
      );
    }

    return (
      <>
        {loading && tools.length === 0 ? (
          <div className="text-center text-white">Loading...</div>
        ) : tools.length === 0 ? (
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
      </>
    );
  }

