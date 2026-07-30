import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Providers } from '@/components/Providers'
import MiniCart from '@/components/MiniCart'

import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  metadataBase: new URL('https://dripeon.com'),
  title: {
    default: 'Dripeon | Premium Indian Streetwear & Urban Fashion',
    template: '%s | Dripeon'
  },
  description: 'Shop the latest premium streetwear at Dripeon. Discover exclusive oversized t-shirts, baggy jeans, hoodies, and urban fashion designed for the Indian hip-hop culture. Get your drip now.',
  keywords: [
    'streetwear india', 'premium streetwear', 'hip hop clothing', 'oversized t-shirts india', 
    'baggy jeans', 'urban fashion', 'mens streetwear', 'womens streetwear', 'drip clothing', 
    'hypebeast fashion', 'skater outfits', 'vintage streetwear', 'street style fashion',
    'dripeon', 'dripeon clothing', 'buy oversized tees online', 'streetwear brands in india'
  ],
  authors: [{ name: 'Dripeon' }],
  creator: 'Dripeon',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://dripeon.com',
    siteName: 'Dripeon',
    title: 'Dripeon | Premium Indian Streetwear & Urban Fashion',
    description: 'Shop the latest premium streetwear at Dripeon. Discover exclusive oversized t-shirts, baggy jeans, and urban fashion designed for the Indian hip-hop culture.',
    images: [
      {
        url: '/hero_mens_streetwear.png',
        width: 1200,
        height: 630,
        alt: 'Dripeon Premium Streetwear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dripeon | Premium Indian Streetwear',
    description: 'Shop the latest premium streetwear at Dripeon. Exclusive oversized tees and urban fashion.',
    images: ['/hero_mens_streetwear.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([
                {
                  '@context': 'https://schema.org',
                  '@type': 'Organization',
                  name: 'Dripeon',
                  url: 'https://dripeon.com',
                  logo: 'https://dripeon.com/logo.png',
                  sameAs: [
                    'https://instagram.com/dripeon',
                    'https://twitter.com/dripeon',
                  ],
                  contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: '+91-9279010494',
                    contactType: 'customer service',
                    availableLanguage: ['English', 'Hindi']
                  }
                },
                {
                  '@context': 'https://schema.org',
                  '@type': 'WebSite',
                  name: 'Dripeon',
                  url: 'https://dripeon.com',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://dripeon.com/search?q={search_term_string}',
                    'query-input': 'required name=search_term_string'
                  }
                }
              ])
            }}
          />
        </head>
        <body suppressHydrationWarning>
          <Providers>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <MiniCart />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
