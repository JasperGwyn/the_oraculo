import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import localFont from 'next/font/local'
import { headers } from 'next/headers'
import ContextProvider from '@/context'
import { WagmiProvider } from '@/providers/WagmiProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Oráculo´s',
  description: 'Powered by Reown'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie')

  return (
    <html lang="en" className={fredoka.variable}>
      <body className={`${fredoka.className} ${inter.className}`}>
        <WagmiProvider>
          <ContextProvider cookies={cookies}>{children}</ContextProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}

const fredoka = localFont({
  src: [
    {
      path: '../public/fonts/Fredoka-Regular.ttf',
      weight: '400',
    },
    {
      path: '../public/fonts/Fredoka-Bold.ttf',
      weight: '700',
    },
  ],
  variable: '--font-fredoka'
})