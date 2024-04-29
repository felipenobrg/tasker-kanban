'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import BoardCard from './boardCard'
import DialogBoard from '../dialogBoard/dialogBoard'
import PostTask from '@/lib/postTask'
import GetTask from '@/lib/getTask'
import { Plus } from 'lucide-react'
import { Task } from '@/types/task'
import { useState, useEffect } from 'react'
import { Reorder } from 'framer-motion'
import { Button } from '../ui/button'

const statusOptions = ['Backlog', 'Em andamento', 'Feito']

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filterValue, setFilterValue] = useState<string>('')

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await GetTask()
        setTasks(tasksData)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }
    fetchTasks()
  }, [])

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleDrop = (newTasks: Task[], status: string) => {}

  const sendTask = async (description: string, status: string) => {
    try {
      await PostTask({ description, status })
      const updatedTasks = await GetTask()
      setTasks(updatedTasks)
    } catch (error) {
      console.error('Error posting task:', error)
    }
  }

  const filteredTasks = tasks.filter((task) =>
    task.description.toLowerCase().includes(filterValue.toLowerCase()),
  )

  return (
    <Dialog.Root>
      <main className="flex flex-1 gap-4 p-4 lg:gap-6 lg:p-6 relative">
        <div className="flex flex-col items-center gap-4">
          <Dialog.Trigger asChild>
            <Button
              className="w-48 p-3 mb-5 bg-gray-800 text-white hover:bg-slate-900 flex gap-2 items-center"
              onClick={handleDialogOpen}
            >
              Adicionar novo item <Plus size={20} />
            </Button>
          </Dialog.Trigger>
          <div className="flex">
            {statusOptions.map((status) => (
              <div key={status} className="flex flex-col ml-20 items-center">
                <h1 className="font-semibold mb-2 mt-2">{status}</h1>
                <Reorder.Group
                  className="flex flex-col gap-5"
                  values={filteredTasks.filter(
                    (task) => task.status === status,
                  )}
                  onReorder={(newTasks: Task[]) => handleDrop(newTasks, status)}
                  axis="x"
                >
                  {filteredTasks
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
            sendTask={sendTask}
          />
        )}
      </main>
    </Dialog.Root>
  )
}
