'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function SubmitToolButton() {
  const router = useRouter()

  return (
    <Button 
      onClick={() => router.push('/submit')} 
      className="mt-4 bbg-primary hover:bg-primary/90"
    >
      Submit AI Tool
    </Button>
  )
}

