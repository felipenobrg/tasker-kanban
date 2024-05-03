'use client'

import * as React from 'react'
import BoardCard from './boardCard'
import { Circle } from 'lucide-react'
import { Task } from '@/types/task'
import { useState, useEffect } from 'react'
import { Reorder } from 'framer-motion'
import { useFilter } from '@/context/filterContext'
import GetTaskById from '@/lib/task/getTaskById'
import { useBoard } from '@/context/boardContext'

const statusOptions = [
  { status: 'Backlog', circleColor: 'gray' },
  { status: 'Em andamento', circleColor: 'purple' },
  { status: 'Feito', circleColor: 'green' },
]

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const { filterValue } = useFilter()
  const { boardId } = useBoard()

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await GetTaskById({ id: boardId })
        setTasks(tasksData)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }
    fetchTasks()
  }, [boardId])

  useEffect(() => {
    const updatedFilteredTasks = tasks.filter((task) =>
      task.description.toLowerCase().includes(filterValue.toLowerCase()),
    )
    setFilteredTasks(updatedFilteredTasks)
  }, [filterValue, tasks])

  const handleDrop = (newTasks: Task[], status: string) => {}

  return (
    <main className="flex flex-1 gap-4 p-4 lg:gap-6 lg:p-6 relative">
      <div className="flex flex-col items-center gap-4">
        <div className="flex">
          {statusOptions.map(({ status, circleColor }) => (
            <div key={status} className="flex flex-col ml-20 items-center">
              <div className="flex items-center justify-center gap-2">
                <Circle size={18} color={circleColor} fill={circleColor} />
                <p className="mb-2 mt-2 text-sm text-gray-400 ">{status}</p>
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
                  <p className="text-gray-400 text-sm mt-2">
                    Não há tarefas nesta categoria.
                  </p>
                )}
              </Reorder.Group>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
