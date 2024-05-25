'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Task } from '@/types/task'
import { Card } from '../ui/card'
import { useState, useEffect } from 'react'
import DeleteTask from '@/lib/task/deleteTask'
import DialogEditTask from '../dialogs/dialogEditTask/dialogEditTask'
import { useTask } from '@/context/taskContext'
import { useTheme } from 'next-themes'
import { Flag } from 'lucide-react'
import getPriorityColor from '@/helpers/getPriorityColors'
import UpdateTask from '@/lib/task/updateTask'
import { useFilter } from '@/context/filterContext'
import Spinner from '@/assets/spinner'

interface BoardCardProps {
  data: Task
  taskId: number
  statusOption: { status: string; circleColor: string }[]
  priorityOptions: { name: string; color: string }[]
  priority: string
}

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text
  } else {
    const truncatedText = text.substring(0, maxLength)
    return truncatedText + '...'
  }
}

export default function BoardCard(props: BoardCardProps) {
  const queryClient = useQueryClient()
  const { data, statusOption, taskId, priority, priorityOptions } = props
  const [dialogOpen, setDialogOpen] = useState(false)
  const { setTaskId, taskData, setTaskData } = useTask()
  const { theme } = useTheme()
  const [isDragging, setIsDragging] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const { filterValue, select } = useFilter()

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleDeleteTask = async (id: number, event?: React.MouseEvent) => {
    event?.stopPropagation()
    await DeleteTask({ id })
    const updatedTasks = taskData.filter((item) => item.ID !== id)
    setTaskData(updatedTasks)
    setDialogOpen(false)
  }

  const { mutate, isSuccess, isPending } = useMutation({
    mutationFn: UpdateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    },
  })

  const handleUpdateTaskStatus = (
    id: number,
    status: string,
    {
      title,
      description,
      priority,
    }: { title: string; description: string; priority: string },
  ) => {
    mutate({
      description,
      title,
      priority,
      status,
      id,
    })

    const updatedTask = {
      ...taskData.find((item) => item.ID === id),
      status,
    }

    const updatedTasks = taskData.map((item) =>
      item.ID === id ? updatedTask : item,
    )

    setTaskData(updatedTasks as Task[])
  }

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    id: number,
    description: string,
    title: string,
    priority: string,
  ) => {
    e.dataTransfer.setData('taskId', id.toString())
    e.dataTransfer.setData('description', description)
    e.dataTransfer.setData('title', title)
    e.dataTransfer.setData('priority', priority)
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleColumnDrop = (
    e: React.DragEvent<HTMLDivElement>,
    status: string,
  ) => {
    e.preventDefault()
    const id = parseInt(e.dataTransfer.getData('taskId'), 10)
    const description = e.dataTransfer.getData('description')
    const title = e.dataTransfer.getData('title')
    const priority = e.dataTransfer.getData('priority')
    handleUpdateTaskStatus(id, status, { title, description, priority })
    setIsDragging(false)
    setDragOver(false)
  }

  useEffect(() => {
    setTaskId(taskId)
  }, [taskId, setTaskId, dialogOpen])

  useEffect(() => {
    setDialogOpen(false)
  }, [isSuccess])

  if (isPending) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (select && select !== 'All' && select !== priority) {
    return null
  }

  return (
    <>
      <div
        className="flex items-center justify-center flex-row"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleColumnDrop(e, data.status)}
      >
        <div className="flex flex-col gap-4">
          {(data.title.toLowerCase().includes(filterValue.toLowerCase()) ||
            data.description
              .toLowerCase()
              .includes(filterValue.toLowerCase())) && (
            <Card
              onClick={handleDialogOpen}
              className={`flex flex-col w-[18rem] h-28 p-3 cursor-pointer rounded group transition-transform transform hover:scale-105 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'
              } ${isDragging ? 'opacity-50 shadow-lg' : ''}  ${
                dragOver
                  ? 'border-2 border-indigo-500 transition-colors duration-300'
                  : ''
              }`}
              draggable
              onDragStart={(e) =>
                handleDragStart(
                  e,
                  data.ID,
                  data.description,
                  data.title,
                  priority,
                )
              }
              onDragEnd={handleDragEnd}
              key={data.ID}
            >
              <div className="flex flex-col items-start justify-start flex-1">
                <h2
                  className={`text-base font-bold group-hover:text-indigo-500 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}
                >
                  {truncateText(data.title, 20)}
                </h2>
                <p
                  className={`text-sm break-words mt-2 font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {truncateText(data.description, 20)}
                </p>
                <p className="ml-auto mt-auto">
                  <Flag
                    size={18}
                    color={getPriorityColor(priority)}
                    fill={getPriorityColor(priority)}
                  />
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
      {dialogOpen && (
        <DialogEditTask
          statusOption={statusOption}
          initialDescription={data.description}
          initialStatus={data.status}
          title={data.title}
          id={data.ID}
          taskId={taskId}
          setDialogOpen={setDialogOpen}
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          handleDeleteTask={() => handleDeleteTask(data.ID)}
          priority={priority}
          priorityOptions={priorityOptions}
        />
      )}
    </>
  )
}
