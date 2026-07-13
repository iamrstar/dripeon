import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'Dripeon | Drip Starts Here',
  description: 'Premium streetwear and hip-hop outfits. Get your drip on.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main>{children}</main>
          {/* Footer will go here */}
        </Providers>
      </body>
    </html>
  )
}
