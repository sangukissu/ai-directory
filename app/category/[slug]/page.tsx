import { CategoryToolsSection } from '@/components/CategoryToolsSection'
import ApolloWrapper from '@/components/ApolloWrapper'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface PageProps {
  params: { slug: string }
}

export default function CategoryPage({ params }: PageProps) {
  const categorySlug = params.slug;
  const categoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' ');

  return (
    <ApolloWrapper>
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
            <Suspense fallback={<div>Loading AI Tools...</div>}>
              <CategoryToolsSection category={categorySlug} categoryName={categoryName} />
            </Suspense>
          </div>
        </main>
      </div>
    </ApolloWrapper>
  )
}

