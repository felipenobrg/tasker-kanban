'use client'

import { Task } from '@/types/task'
import { Card } from '../ui/card'
import { Reorder } from 'framer-motion'
import { useEffect, useState } from 'react'
import DeleteTask from '@/lib/task/deleteTask'
import UpdateTask from '@/lib/task/updateTask'
import DialogEditTask from '../dialogs/dialogEditTask/dialogEditTask'
import { useTask } from '@/context/taskContext'

interface BoardCardProps {
  data: Task
  taskId: number
  statusOption: { status: string; circleColor: string }[]
}

const truncateDescription = (
  description: string,
  maxLength: number,
): string => {
  if (description.length <= maxLength) {
    return description
  } else {
    const lastSpaceIndex = description.lastIndexOf(' ', maxLength)
    return description.substring(0, lastSpaceIndex) + '...'
  }
}

export default function BoardCard(props: BoardCardProps) {
  const { data, statusOption, taskId } = props
  const [task, setTask] = useState<Task[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const { setTaskId } = useTask()

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleDeleteTask = async (id: number, event?: React.MouseEvent) => {
    event?.stopPropagation()
    await DeleteTask({ id })
    const updatedTasks = task.filter((item) => item.ID !== id)
    setTask(updatedTasks)
    setDialogOpen(false)
  }

  const handleUpdateTask = async (
    title: string,
    id: number,
    description: string,
    status: string,
  ) => {
    try {
      await UpdateTask({ id, title, description, status })
      const updatedTask = {
        ...task.find((item) => item.ID === id),
        title,
        description,
        status,
      }
      const updatedTasks = task.map((item) =>
        item.ID === id ? updatedTask : item,
      )
      setTask(updatedTasks as Task[])
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  useEffect(() => {
    setTask([data])
  }, [data, setTask])

  useEffect(() => {
    setTaskId(taskId)
  }, [taskId, setTaskId])

  return (
    <div>
      <div className="flex flex-row ml-5">
        <div className="flex flex-col gap-4">
          <div>
            {task.map((item) => (
              <Reorder.Item value={item} key={item.ID}>
                <Card
                  onClick={handleDialogOpen}
                  className="flex flex-col bg-gray-800 w-60 h-28 p-3"
                >
                  <div className="flex flex-col items-start justify-start">
                    <h2 className="text-gray-200 text-base font-bold">
                      {item.title}
                    </h2>
                    <p className="text-gray-300 text-sm break-words mt-2 font-medium">
                      {truncateDescription(item.description, 35)}
                    </p>
                  </div>
                </Card>
              </Reorder.Item>
            ))}
          </div>
        </div>
      </div>
      <DialogEditTask
        statusOption={statusOption}
        initialDescription={data.description}
        initialStatus={data.status}
        title={data.title}
        id={data.ID}
        taskId={taskId}
        setDialogOpen={setDialogOpen}
        onUpdateTask={handleUpdateTask}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        handleDeleteTask={() => handleDeleteTask(data.ID)}
      />
    </div>
  )
}
