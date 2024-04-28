'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '../ui/button'
import BoardCard from './boardCard'
import DialogBoard from '../dialogBoard/dialogBoard'
import { Task } from '@/types/task'
import { useState } from 'react'
import { Reorder } from 'framer-motion'

interface BoardProps {
  tasks: Task[]
}

const statusOptions = ['Backlog', 'Em andamento', 'Feito']

export default function Board(props: BoardProps) {
  const { tasks } = props
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleDrop = (newTasks: Task[], status: string) => {}

  return (
    <Dialog.Root>
      <main className="flex flex-1 gap-4 p-4 lg:gap-6 lg:p-6 relative">
        <div className="flex flex-col items-center gap-4">
          <Dialog.Trigger asChild>
            <Button
              className="w-48 p-3 mb-5 bg-gray-800 text-white hover:bg-slate-900"
              onClick={handleDialogOpen}
            >
              Adicionar novo item
            </Button>
          </Dialog.Trigger>
          <div className="flex flex-row gap-3">
            {statusOptions.map((status) => (
              <div key={status} className="flex flex-col gap-4">
                <h1 className="font-semibold mb-1">{status}</h1>
                <Reorder.Group
                  className="flex flex-col gap-5"
                  values={tasks.filter((task) => task.status === status)}
                  onReorder={(newTasks: Task[]) => handleDrop(newTasks, status)}
                  axis="x"
                >
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => (
                      <BoardCard
                        key={index}
                        data={task}
                        statusOption={statusOptions}
                      />
                    ))}
                </Reorder.Group>
              </div>
            ))}
          </div>
        </div>
        {dialogOpen && (
          <DialogBoard
            statusOptions={statusOptions}
            setDialogOpen={setDialogOpen}
          />
        )}
      </main>
    </Dialog.Root>
  )
}
