'use client'

import * as React from 'react'
import BoardCard from './boardCard'
import { Circle } from 'lucide-react'
import { Task } from '@/types/task'
import { useState, useEffect } from 'react'
import { Reorder } from 'framer-motion'
import { useFilter } from '@/context/filterContext'
import UpdateTask from '@/lib/task/updateTask'
import { useBoard } from '@/context/boardContext'
import GetBoardById from '@/lib/boards/getBoardById'

const statusOptions = [
  { status: 'Pendente', circleColor: 'gray' },
  { status: 'Em andamento', circleColor: 'purple' },
  { status: 'Feito', circleColor: 'green' },
]

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const { filterValue } = useFilter()
  const { boardId } = useBoard()

  const handleDrop = async (newTasks: Task[], newStatus: string) => {
    try {
      const updatedTasks = newTasks.map((task, index) => ({
        ...task,
        status: newStatus,
        id: task.ID,
        order: index,
      }))
      await Promise.all(updatedTasks.map((task) => UpdateTask(task)))
      setTasks(updatedTasks)
    } catch (error) {
      console.error('Error updating tasks:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const boardResponse = await GetBoardById({ id: boardId })
        const boardData = boardResponse.data
        setTasks(boardData.tasks || [])
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }
    fetchData()
  }, [boardId])

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
                values={tasks.map((task) => task.ID)}
                onReorder={(newOrder) => {
                  console.log('New order:', newOrder)
                  const newTasksOrder = newOrder.map(
                    (taskId) => tasks.find((task) => task.ID === taskId)!,
                  )
                  handleDrop(newTasksOrder, status)
                }}
                axis="x"
              >
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <BoardCard
                      key={task.ID}
                      taskId={task.ID}
                      data={task}
                      statusOption={statusOptions}
                    />
                  ))}
                {tasks.filter((task) => task.status === status).length ===
                  0 && (
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
