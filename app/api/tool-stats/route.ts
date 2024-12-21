import { NextResponse } from 'next/server'
import { gql } from '@apollo/client'
import client from '@/lib/apollo-client'

const GET_TOOL_STATS = gql`
  query GetToolStats {
    aiTools(first: 1000) {
      nodes {
        id
      }
    }
    aiToolCategories(first: 1000) {
      nodes {
        id
      }
    }
  }
`

export async function GET() {
  try {
    const { data } = await client.query({
      query: GET_TOOL_STATS,
      fetchPolicy: 'no-cache'
    })

    return NextResponse.json({
      toolCount: data.aiTools.nodes.length,
      categoryCount: data.aiToolCategories.nodes.length
    })
  } catch (error) {
    console.error('Error fetching tool stats:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch tool stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

