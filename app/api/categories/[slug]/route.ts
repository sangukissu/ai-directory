import { NextRequest, NextResponse } from 'next/server'
import { gql } from '@apollo/client'
import client from '@/lib/apollo-client'

const GET_CATEGORY = gql`
  query GetCategory($slug: ID!) {
    aiToolCategory(id: $slug, idType: SLUG) {
      name
      description
      slug
    }
  }
`

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  try {
    const { data } = await client.query({
      query: GET_CATEGORY,
      variables: { slug },
      fetchPolicy: 'no-cache',
    })

    if (!data.aiToolCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(data.aiToolCategory)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

