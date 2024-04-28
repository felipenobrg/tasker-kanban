'use client'

import { Task } from '@/types/task'
import { Card } from '../ui/card'
import { Reorder } from 'framer-motion'
import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import DialogTask from '../dialogTask/dialogTask'
interface BoardCardProps {
  data: Task
  statusOption: string[]
}

export default function BoardCard(props: BoardCardProps) {
  const { data, statusOption } = props
  const [task, setTask] = useState<Task[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  useEffect(() => {
    setTask([data])
  }, [data])

  return (
    <Dialog.Root>
      <div className="flex flex-row ml-5">
        <div className="flex flex-col gap-4">
          <Reorder.Group
            className="flex flex-col gap-5"
            values={task}
            onReorder={setTask}
            axis="x"
          >
            {task.map((item) => (
              <Reorder.Item value={item} key={item.description}>
                <Dialog.Trigger asChild>
                  <Card onClick={handleDialogOpen}>
                    <p className="text-gray-200 text-sm">{item.description}</p>
                  </Card>
                </Dialog.Trigger>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>
      {dialogOpen && (
        <DialogTask
          statusOption={statusOption}
          initialDescription={data.description}
          initialStatus={data.status}
          id={data.ID}
          setDialogOpen={setDialogOpen}
        />
      )}
    </Dialog.Root>
  )
}
