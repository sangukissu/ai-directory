'use client'

import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDebounce } from '@/hooks/use-debounce'
import Link from 'next/link'

interface ToolStats {
  toolCount: number | string;
  categoryCount: number | string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  description: string;
}

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  };
}

export function ToolsHeader() {
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState<ToolStats | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/tool-stats')
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats({ toolCount: 'N/A', categoryCount: 'N/A' })
      }
    }

    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data.nodes)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchStats()
    fetchCategories()
  }, [])

  useEffect(() => {
    async function searchTools() {
      if (debouncedSearchTerm) {
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedSearchTerm)}`)
          if (!response.ok) {
            throw new Error('Failed to search tools')
          }
          const data = await response.json()
          setSearchResults(data)
        } catch (error) {
          console.error('Error searching tools:', error)
          setSearchResults([])
        }
      } else {
        setSearchResults([])
      }
    }

    searchTools()
  }, [debouncedSearchTerm])

  return (
    <div className="bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Discover AI Tools</h1>
        <p className="text-xl mb-8 text-gray-300">Explore our curated collection of cutting-edge AI tools to supercharge your workflow</p>
        
        <div className="flex gap-4 mb-8">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search AI tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-lg shadow-lg">
                {searchResults.map((result) => (
                  <Link 
                    key={result.id} 
                    href={`/tool/${result.slug}`}
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    {result.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-white">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              {categories.map((category) => (
                <DropdownMenuItem key={category.id} className="focus:bg-gray-700">
                  <Link 
                    href={`/category/${category.slug}`}
                    className="block w-full"
                  >
                    {category.name} ({category.count})
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 flex-1 min-w-[200px] border border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
            <h3 className="text-lg font-semibold mb-2">{stats?.toolCount ?? '...'}</h3>
            <p className="text-sm text-gray-300">AI Tools Listed</p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 flex-1 min-w-[200px] border border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.4)]">
            <h3 className="text-lg font-semibold mb-2">{stats?.categoryCount ?? '...'}</h3>
            <p className="text-sm text-gray-300">Categories</p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 flex-1 min-w-[200px] border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]">
            <h3 className="text-lg font-semibold mb-2">Everyday</h3>
            <p className="text-sm text-gray-300">New Tools Added</p>
          </div>
        </div>
      </div>
    </div>
  )
}

