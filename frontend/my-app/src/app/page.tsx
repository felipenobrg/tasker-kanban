'use client'

import { useRouter } from 'next/navigation'
import Sidebar from '@/components/sidebar/sidebar'
import Header from '@/components/header/header'
import Board from '@/components/board/board'
import { useSession } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'

export const dynamic = 'force-dynamic'

export default function Home() {
  const router = useRouter()
  const { data: session } = useSession()

  if (!session) {
    router.push('/login')
    return null
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ">
        <Sidebar />
        <div className="flex flex-col">
          <Header />
          <Board />
        </div>
      </div>
    </ThemeProvider>
  )
}
