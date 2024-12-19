import { NextResponse } from 'next/server'
import { gql } from '@apollo/client'
import client from '@/lib/apollo-client'

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
  aiTools: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    edges: AIToolEdge[];
  };
}

const GET_AI_TOOLS = gql`
  query GetAITools($first: Int!, $after: String) {
    aiTools(first: $first, after: $after, where: { status: PUBLISH }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          excerpt
          slug
          aiToolCategories {
            nodes {
              name
              slug
            }
          }
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  }
`

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const first = parseInt(searchParams.get('first') || '20', 10)
  const after = searchParams.get('after')
  const category = searchParams.get('category')

  try {
    const { data } = await client.query<AIToolsResponse>({
      query: GET_AI_TOOLS,
      variables: { 
        first,
        after
      },
      fetchPolicy: 'no-cache'
    })

    let filteredTools = data.aiTools.edges;

    if (category) {
      const decodedCategory = decodeURIComponent(category).toLowerCase();
      filteredTools = filteredTools.filter((edge: AIToolEdge) => 
        edge.node.aiToolCategories.nodes.some((cat: AIToolCategory) => 
          cat.slug.toLowerCase() === decodedCategory ||
          cat.name.toLowerCase().replace(/\s+/g, '-') === decodedCategory
        )
      );
    }

    console.log(`Category: ${category}, Filtered Tools Count: ${filteredTools.length}`);

    return NextResponse.json({
      pageInfo: data.aiTools.pageInfo,
      edges: filteredTools
    })
  } catch (error) {
    console.error('Error fetching AI Tools:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch AI Tools',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

