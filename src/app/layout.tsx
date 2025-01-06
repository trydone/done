'use client'
import './globals.css'

import { ZeroProvider } from '@rocicorp/zero/react'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'

import { Toaster } from '@/components/ui/sonner'
import { RootStoreProvider } from '@/lib/stores/root-store-provider'
import { createZero } from '@/lib/zero-setup'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const zero = createZero()

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full font-sans font-normal antialiased`}
      suppressHydrationWarning
    >
      <meta name="apple-mobile-web-app-title" content="Done" />
      <body className="h-full bg-background">
        <ZeroProvider zero={zero}>
          <RootStoreProvider>{children}</RootStoreProvider>
        </ZeroProvider>

        <Toaster position="bottom-right" duration={2000} closeButton />
      </body>
    </html>
  )
}
