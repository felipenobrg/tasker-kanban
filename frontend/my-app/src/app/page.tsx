import Sidebar from '@/components/sidebar/sidebar'
import Header from '@/components/header/header'
import Board from '@/components/board/board'
import { Suspense } from 'react'
import Spinner from '@/assets/spinner'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="min-h-screen w-full grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <Board />
      </div>
    </div>
  )
}
