'use client'

import * as React from 'react'
import BoardCard from './boardCard'
import { Circle } from 'lucide-react'
import { Task } from '@/types/task'
import { useState, useEffect } from 'react'
import { Reorder } from 'framer-motion'
import { useFilter } from '@/context/filterContext'
import GetTask from '@/lib/task/getTask'
import UpdateTask, { UpdateTaskProps } from '@/lib/task/updateTask'

const statusOptions = [
  { status: 'Backlog', circleColor: 'gray' },
  { status: 'Em andamento', circleColor: 'purple' },
  { status: 'Feito', circleColor: 'green' },
]

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const { filterValue } = useFilter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskValue = await GetTask()
        setTasks(taskValue)
        console.log('TASKS', tasks)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }
    fetchData()
  }, [tasks])

  useEffect(() => {
    if (tasks && filterValue) {
      const updatedFilteredTasks = tasks.filter(
        (task) =>
          task.description &&
          task.description.toLowerCase().includes(filterValue.toLowerCase()),
      )
      setFilteredTasks(updatedFilteredTasks)
    }
  }, [filterValue, tasks])

  useEffect(() => {
    const updatedFilteredTasks = tasks.filter((task) =>
      task.description.toLowerCase().includes(filterValue.toLowerCase()),
    )
    setFilteredTasks(updatedFilteredTasks)
  }, [filterValue, tasks])

  const handleDrop = async (newTasks: Task[], newStatus: string) => {
    try {
      const updatedTasks = newTasks.map((task) => ({
        ...task,
        status: newStatus,
      }))

      for (const updatedTask of updatedTasks) {
        await UpdateTask(updatedTask)
      }

      setTasks(updatedTasks)
    } catch (error) {
      console.error('Error updating tasks:', error)
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
