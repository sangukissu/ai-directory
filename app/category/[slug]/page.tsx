import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Metadata } from 'next'
import ApolloWrapper from '@/components/ApolloWrapper'
import { CategoryPage as CategoryPageContent } from '@/components/CategoryPage'

interface CategoryData {
  name: string;
  description: string;
  slug: string;
}

async function getCategoryData(slug: string): Promise<CategoryData> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${apiUrl}/api/categories/${slug}`, { next: { revalidate: 3600 } });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch category data: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const categoryData = await getCategoryData(params.slug);
    return {
      title: `${categoryData.name} AI Tools | Geekdroid`,
      description: categoryData.description || `Explore ${categoryData.name} AI tools and solutions for your needs`,
      openGraph: {
        title: `${categoryData.name} AI Tools | Geekdroid`,
        description: categoryData.description || `Explore ${categoryData.name} AI tools and solutions for your needs`,
        url: `https://geekdroid.in/category/${categoryData.slug}`,
        siteName: 'Geekdroid',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${categoryData.name} AI Tools | Geekdroid`,
        description: categoryData.description || `Explore ${categoryData.name} AI tools and solutions for your needs`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {};
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  let categoryData: CategoryData;
  
  try {
    categoryData = await getCategoryData(params.slug);
  } catch (error) {
    console.error('Error fetching category data:', error);
    notFound();
  }

  return (
    <ApolloWrapper>
      <div className="min-h-screen bg-black">
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <nav className="flex items-center space-x-2 text-sm mb-4 bg-[#0d1117] rounded-xl border border-[#1d2433] px-4 py-2">
            <Link href="/" className="text-gray-400 hover:text-white">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-white">{categoryData.name}</span>
          </nav>
          
          <div className="mx-auto bg-[#0d1117] rounded-2xl border border-[#1d2433] p-5">
            <h1 className="text-3xl font-bold text-white mb-4">{categoryData.name} AI Tools</h1>
            {categoryData.description && (
              <p className="text-gray-400 mb-8">{categoryData.description}</p>
            )}
            
            <Suspense fallback={<div className="text-white">Loading AI Tools...</div>}>
              <CategoryPageContent slug={params.slug} initialCategoryName={categoryData.name} />
            </Suspense>
          </div>
        </main>
      </div>
    </ApolloWrapper>
  )
}

