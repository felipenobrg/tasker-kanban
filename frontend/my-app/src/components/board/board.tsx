'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import BoardCard from './boardCard'
import PostTask from '@/lib/postTask'
import GetTask from '@/lib/getTask'
import DialogBoard from '../dialogs/dialogBoard/dialogBoard'
import { Circle } from 'lucide-react'
import { Task } from '@/types/task'
import { useState, useEffect } from 'react'
import { Reorder } from 'framer-motion'
import { useFilter } from '@/context/filterContext'
import { useDialog } from '@/context/dialogContext'

const statusOptions = [
  { status: 'Backlog', circleColor: 'gray' },
  { status: 'Em andamento', circleColor: 'purple' },
  { status: 'Feito', circleColor: 'green' },
]

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const { filterValue } = useFilter()
  const { isOpen } = useDialog()

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

  useEffect(() => {
    const updatedFilteredTasks = tasks.filter((task) =>
      task.description.toLowerCase().includes(filterValue.toLowerCase()),
    )
    setFilteredTasks(updatedFilteredTasks)
  }, [filterValue, tasks])

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

  return (
    <main className="flex flex-1 gap-4 p-4 lg:gap-6 lg:p-6 relative">
      <div className="flex flex-col items-center gap-4">
        <div className="flex">
          {statusOptions.map(({ status, circleColor }) => (
            <div key={status} className="flex flex-col ml-20 items-center">
              <div className="flex items-center justify-center gap-2">
                <Circle size={18} color={circleColor} fill={circleColor} />
                <p className="mb-2 mt-2 text-sm">{status}</p>
              </div>
              <Reorder.Group
                className="flex flex-col gap-5"
                values={filteredTasks.filter((task) => task.status === status)}
                onReorder={(newTasks: Task[]) => handleDrop(newTasks, status)}
              >
                {filteredTasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <BoardCard
                      key={task.ID}
                      data={task}
                      statusOption={statusOptions}
                    />
                  ))}
                {filteredTasks.length === 0 && (
                  <p className="text-sm mt-2">
                    Não há tarefas nesta categoria.
                  </p>
                )}
              </Reorder.Group>
            </div>
          ))}
          {isOpen && (
            <DialogBoard statusOption={statusOptions} sendTask={sendTask} />
          )}
        </div>
      </div>
    </main>
  )
}
