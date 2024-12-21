'use client'

import { useEffect } from 'react'
import { adsenseConfig } from '@/lib/adsense-config'

interface AdSenseProps {
  adSlot: string
  adFormat?: string
  fullWidthResponsive?: boolean
}

export function AdSense({ adSlot, adFormat = 'auto', fullWidthResponsive = true }: AdSenseProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error(err)
    }
  }, [])

  if (!adsenseConfig.enabled) {
    return null
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={adsenseConfig.client}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive}
    />
  )
}
