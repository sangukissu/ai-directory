import './globals.css'
import { Inter } from 'next/font/google'
import { SiteNav } from '@/components/site-nav'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import { generateMetadata, generateWebSiteSchema } from '@/lib/seo-utils'
import { adsenseConfig } from '@/lib/adsense-config'
import Script from 'next/script'
import { AdSense } from '@/components/AdSense'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = generateMetadata({
  title: "Geekdroid | AI Tools Directory",
  description: "Discover and compare the best AI tools for your business",
  canonical: "https://geekdroid.in"
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const webSiteSchema = generateWebSiteSchema()

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        {adsenseConfig.enabled && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseConfig.client}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <SiteNav />
          <main className="flex-grow">
            {children}
          </main>
          <AdSense adSlot="2468013579" adFormat="auto" fullWidthResponsive={true} />
          <Footer />
        </div>
      </body>
    </html>
  )
}
