'use client'

import { ArrowRight, BarChart2, Code, Image, MessageSquare, Video, Wand2, Music, Box, Briefcase, Grid } from 'lucide-react'
import Link from 'next/link'
import { Card } from "@/components/ui/card"
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Map of category names to their icons and descriptions
const categoryMeta: Record<string, { icon: any; description: string; color: string }> = {
  'Text': {
    icon: MessageSquare,
    description: 'Text generation, processing, and language models for content creation.',
    color: 'from-blue-500'
  },
  'Image': {
    icon: Image,
    description: 'AI-powered image generation, editing, and enhancement tools.',
    color: 'from-purple-500'
  },
  'Voice': {
    icon: Wand2,
    description: 'Voice synthesis, recognition, and audio processing solutions.',
    color: 'from-green-500'
  },
  'Video': {
    icon: Video,
    description: 'Video creation, editing, and AI-enhanced production tools.',
    color: 'from-red-500'
  },
  'Code': {
    icon: Code,
    description: 'Code generation, analysis, and development assistance tools.',
    color: 'from-yellow-500'
  },
  'Data Analysis': {
    icon: BarChart2,
    description: 'Advanced data processing, visualization, and analytics platforms.',
    color: 'from-cyan-500'
  },
  'Audio': {
    icon: Music,
    description: 'Audio processing, music generation, and sound editing tools.',
    color: 'from-indigo-500'
  },
  '3D': {
    icon: Box,
    description: '3D modeling, animation, and visualization tools.',
    color: 'from-pink-500'
  },
  'Business': {
    icon: Briefcase,
    description: 'Business automation, productivity, and management tools.',
    color: 'from-orange-500'
  },
  'Other': {
    icon: Grid,
    description: 'Other innovative AI tools and solutions.',
    color: 'from-violet-500'
  }
}

export function CategoriesSection() {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data.nodes || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return (
      <section className="py-20 bg-black">
        <div className="max-w-7xl px-4 mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-64 bg-gray-800 rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-800 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-400">Error: {error}</div>
    )
  }

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl px-4 mx-auto">
        <div className="flex flex-col gap-4 mb-12">
          <div className="flex  sm:flex-row justify-between items-start sm:items-center w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-200">AI Tool Categories</h2>
          <Link 
              href="/categories" 
              className="inline-flex items-center px-2 py-2 text-gray-400 hover:bg-gray-700 transition-colors"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <p className="text-gray-400 max-w-lg">
            Explore our curated collection of AI tools across different categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 6).map((category, index) => {
            const meta = categoryMeta[category.name] || {
              icon: Grid,
              description: `Discover ${category.name.toLowerCase()} AI tools and solutions.`,
              color: 'from-gray-500'
            }
            const Icon = meta.icon

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="group block h-full"
                >
                  <Card className="h-full bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 transition-all duration-300 hover:border-white/50 hover:shadow-lg hover:shadow-white/10">
                    <div className="p-6 space-y-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${meta.color} to-transparent/10 flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <Icon strokeWidth={1.5} className="h-8 w-8 text-white" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                          <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {meta.description}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-gray-700">
                        <span className="text-sm text-gray-500">
                          {category.count} {category.count === 1 ? 'tool' : 'tools'} available
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

