'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '../ui/button'
import BoardCard from './boardCard'
import { Task } from '@/types/task'
import DialogBoard from '../dialogBoard/dialogBoard'

interface BoardProps {
  tasks: Task[]
}

const statusOptions = ['Backlog', 'Em andamento', 'Feito']

export default function Board(props: BoardProps) {
  const { tasks } = props
  console.log(tasks)

  return (
    <Dialog.Root>
      <main className="flex flex-1 gap-4 p-4 lg:gap-6 lg:p-6 relative">
        <div className="flex flex-col items-center gap-4">
          <Dialog.Trigger asChild>
            <Button className="w-48 p-3 mb-5 bg-gray-800 text-white hover:bg-slate-900">
              Adicionar novo item
            </Button>
          </Dialog.Trigger>
          <div className="flex flex-row gap-3">
            {tasks.map((task, index) => (
              <BoardCard key={index} data={[task]} status={statusOptions} />
            ))}
          </div>
        </div>

        <DialogBoard statusOptions={statusOptions} />
      </main>
    </Dialog.Root>
  )
}
