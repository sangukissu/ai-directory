'use client'

import { Button } from "@/components/ui/button"

export default function TryAgainButton() {
  return (
    <Button 
      onClick={() => window.location.reload()} 
      className="mt-4 bg-primary hover:bg-primary/90"
    >
      Try Again
    </Button>
  )
}

