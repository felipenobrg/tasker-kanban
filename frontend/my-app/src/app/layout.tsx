import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/providers/combined-providers'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tasker',
  description: 'Gerenciador de Tarefas',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session && typeof window !== 'undefined') {
    redirect('/login')
  }

  return (
    <Providers>
      <html lang="en">
        <head />
        <body className={inter.className}>
          <div className="font-jakarta">{children}</div>
        </body>
      </html>
    </Providers>
  )
}
