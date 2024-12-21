'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bookmark, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { AdSense } from "@/components/AdSense"


interface BookmarkedTool {
  slug: string
  name: string
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Record<string, BookmarkedTool>>({})

  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}')
    setBookmarks(storedBookmarks)
  }, [])

  const removeBookmark = (slug: string) => {
    const updatedBookmarks = { ...bookmarks }
    delete updatedBookmarks[slug]
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks))
    setBookmarks(updatedBookmarks)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold mb-8">Your Bookmarked Tools</h1>
        <AdSense adSlot="1234567890" adFormat="auto" fullWidthResponsive={true} />

        {Object.keys(bookmarks).length === 0 ? (
          <p className="text-gray-400">You haven't bookmarked any tools yet.</p>
        ) : (
          <ul className="space-y-4">
            {Object.entries(bookmarks).map(([slug, tool]) => (
              <li key={slug} className="flex items-center justify-between bg-[#0d1117] rounded-xl border border-[#1d2433] p-4">
                <div className="flex items-center">
                  <Bookmark className="mr-2 h-5 w-5 text-primary" />
                  <Link href={`/tool/${slug}`} className="text-lg hover:text-primary/90 transition-colors">
                    {tool.name}
                  </Link>
                </div>
                <Button
                  onClick={() => removeBookmark(slug)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

