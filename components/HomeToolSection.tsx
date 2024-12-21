'use client'

import { useState, useEffect } from 'react'
import { ToolCard } from "@/components/tool-card"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import TryAgainButton from '@/components/TryAgainButton'
import SubmitToolButton from '@/components/SubmitToolButton'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

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

interface AIToolsResponse {
  edges: {
    node: AITool;
  }[];
}

async function getLatestAITools(): Promise<AIToolsResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const url = new URL(`${apiUrl}/api/ai-tools`);
  url.searchParams.append('first', '12');

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to fetch AI Tools: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export function AIToolsSection() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadTools() {
      try {
        const data = await getLatestAITools();
        setTools(data.edges.map(edge => edge.node));
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    }

    loadTools();
  }, []);

  if (loading) {
    return <div className="text-white text-center">Loading AI Tools...</div>;
  }

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

  if (tools.length === 0) {
    return (
      <Alert className="bg-yellow-900 border-yellow-800">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No AI Tools Found</AlertTitle>
        <AlertDescription>
          No AI tools are currently available. Please check back later or submit your own tool.
        </AlertDescription>
        <SubmitToolButton />
      </Alert>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
       <div className="flex flex-col gap-4 mb-12">
          <div className="flex  sm:flex-row justify-between items-start sm:items-center w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-200">Latest AI Tools</h2>
          <Link 
              href="/tools" 
              className="inline-flex items-center px-2 py-2 text-gray-400 hover:bg-gray-700 transition-colors"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <p className="text-gray-400 max-w-lg">
          Discover Best AI Tools for Every Need in One Place!
          </p>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            title={tool.title}
            category={tool.aiToolCategories.nodes[0]?.name || "AI Tool"}
            slug={tool.slug}
            previewImage={tool.featuredImage?.node?.sourceUrl || "/placeholder.svg"}
            logo={tool.featuredImage?.node?.sourceUrl || "/placeholder.svg"}
            isVerified={Math.random() > 0.5}
          />
        ))}
      </div>
    </div>
  );
}

