import Sidebar from '@/components/sidebar/sidebar'
import Header from '@/components/header/header'
import Board from '@/components/board/board'
import { getServerSession } from 'next-auth'

export default async function Home() {
  const session = await getServerSession()

  return (
    <div
      className={`grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] `}
    >
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <Board />
      </div>
      <h1>Olá {session?.user?.name}</h1>
    </div>
  )
}
