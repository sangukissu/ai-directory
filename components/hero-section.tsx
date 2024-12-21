'use client'

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebounce } from '@/hooks/use-debounce'
import { sanitizeSearchTerm } from '@/lib/utils'
import { AnimatedBackground } from './AnimatedBackground'

interface AITool {
  id: string;
  title: string;
  slug: string;
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  };
}

const popularTools = [
  { name: 'loopin', logo: '/placeholder.svg' },
  { name: 'bing chat', logo: '/placeholder.svg' },
  { name: 'Adobe', logo: '/placeholder.svg' },
  { name: 'monica', logo: '/placeholder.svg' },
  { name: 'Chat GPT', logo: '/placeholder.svg' },
  { name: 'Jasper', logo: '/placeholder.svg' },
]

export function HeroSection() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<AITool[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const searchAITools = async () => {
      if (debouncedSearchTerm.length >= 3) {
        setIsLoading(true)
        try {
          const sanitizedTerm = sanitizeSearchTerm(debouncedSearchTerm)
          const response = await fetch(`/api/search?q=${encodeURIComponent(sanitizedTerm)}`)
          if (!response.ok) {
            throw new Error('Search request failed')
          }
          const data = await response.json()
          setSearchResults(data)
        } catch (error) {
          console.error('Error searching AI tools:', error)
          setSearchResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setSearchResults([])
      }
    }

    searchAITools()
  }, [debouncedSearchTerm])

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-black">
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gray-300">Discover Best </span>
            <span className="bg-gradient-to-r from-[#FF4B4B] to-[#FF6B6B] text-transparent bg-clip-text">AI</span>
            {' '}
            <span className="bg-gradient-to-r from-[#4ECDC4] via-[#45B7D1] to-[#8A2BE2] text-transparent bg-clip-text">Tools</span>
            {' '}
            <span className="text-gray-300">for Every Need</span>
            <br />
            <span className="bg-gradient-to-r from-[#4ECDC4] via-[#45B7D1] to-[#8A2BE2] text-transparent bg-clip-text">in One Place!</span>
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore, Compare, and Choose from a Curated Directory of AI Tools for Business, Creativity, Development, and More.
          </motion.p>
          
          <motion.div 
            className="max-w-2xl mx-auto mb-12 relative"
            ref={searchRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search AI tools..."
                className="w-full pl-14 pr-6 py-6 bg-gray-800/50  border-2 border-gray-700 rounded-full text-gray-100 placeholder:text-gray-400 text-lg focus:ring-2 focus:ring-cyan-500 transition-all duration-300 ease-in-out"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <AnimatePresence>
              {(searchResults.length > 0 || isLoading) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-2 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
                >
                  {isLoading ? (
                    <div className="p-6 text-center text-gray-300">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mx-auto mb-2"></div>
                      Searching...
                    </div>
                  ) : (
                    <ul className="max-h-96 overflow-y-auto">
                      {searchResults.map((tool) => (
                        <li key={tool.id} className="border-b border-gray-700 last:border-b-0">
                          <Link href={`/tool/${tool.slug}`} className="flex items-center p-4 hover:bg-gray-700 transition-colors duration-200">
                            <Image
                              src={tool.featuredImage?.node?.sourceUrl || '/placeholder.svg'}
                              alt={tool.title}
                              width={48}
                              height={48}
                              className="rounded-full mr-4"
                            />
                            <span className="text-white text-lg">{tool.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
          <Link href="/tools">
  <Button
    size="lg"
    className="rounded-full bg-primary text-white hover:bg-primary/90 transition-all duration-300 ease-in-out transform hover:scale-105"
  >
    Explore All AI Tools
  </Button>
</Link>

<Link href="/categories">
  <Button
    size="lg"
    variant="outline"
    className="rounded-full hover:text-white border-2 border-gray-600 hover:bg-gray-700/50 transition-all duration-300 ease-in-out transform hover:scale-105"
  >
    View All Categories
  </Button>
</Link>
          </motion.div>

          <motion.div 
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 md:gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {popularTools.map((tool, index) => (
              <Link 
                key={tool.name}
                href={`/tool/${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex flex-col items-center gap-3 group"
              >
                <motion.div 
                  className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-400 to-purple-500 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  <Image
                    src={tool.logo}
                    alt={tool.name}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-80"
                  />
                </motion.div>
                <span className="text-gray-300 text-sm md:text-base font-medium group-hover:text-white transition-colors duration-200">{tool.name}</span>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
      <AnimatedBackground />
    </section>
  )
}

