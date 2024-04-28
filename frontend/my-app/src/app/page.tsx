import Sidebar from '@/components/sidebar/sidebar'
import Header from '@/components/header/header'
import Board from '@/components/board/board'
import GetTask from '@/lib/getTask'

export default async function Home() {
  const tasks = await GetTask()
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <Board tasks={tasks} />
      </div>
    </div>
  )
}
