'use client'

import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface BookmarkButtonProps {
  toolSlug: string
  toolName: string
}

export function BookmarkButton({ toolSlug, toolName }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}')
    setIsBookmarked(!!bookmarks[toolSlug])
  }, [toolSlug])

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}')
    
    if (isBookmarked) {
      delete bookmarks[toolSlug]
    } else {
      bookmarks[toolSlug] = { name: toolName, slug: toolSlug }
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    setIsBookmarked(!isBookmarked)
  }

  return (
    <Button
      onClick={toggleBookmark}
      variant={isBookmarked ? "secondary" : "outline"}
      size="sm"
      className="ml-4 bg-black px-4 py-2 border text-white border-[#1d2433]"
    >
      <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
    </Button>
  )
}

