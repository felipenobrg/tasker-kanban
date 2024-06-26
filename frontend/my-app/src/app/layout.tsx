import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/providers/combined-providers'
import { ReactNode, Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tasker',
  description: 'Gerenciador de Tarefas',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Gerenciador de Tarefas" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="font-jakarta">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
