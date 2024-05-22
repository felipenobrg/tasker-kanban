'use client'

import { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import UpdateSubtasks from '@/lib/subtasks/updateSubtask'
import { useTheme } from 'next-themes'

interface SubTaskCardProps {
  name: string
  subtaskId: number | undefined
  status: string
}

export default function SubtaskCard(props: SubTaskCardProps) {
  const queryClient = useQueryClient()
  const { name, subtaskId, status } = props
  const [isChecked, setIsChecked] = useState(status === 'Enabled')
  const { theme } = useTheme()

  const { mutate: mutateSubtask } = useMutation({
    mutationFn: UpdateSubtasks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subtasks'] })
    },
  })

  const handleCheckboxChange = (newCheckedState: boolean) => {
    setIsChecked(newCheckedState)
    const newStatus = newCheckedState ? 'Enabled' : 'Disabled'
    handleUpdateSubstaskStatus(subtaskId, newStatus)
  }

  const handleUpdateSubstaskStatus = (
    id: number | undefined,
    newStatus: string,
  ) => {
    if (id !== undefined) {
      try {
        mutateSubtask({ name, id, status: newStatus })
      } catch (error) {
        console.error('Error updating subtask:', error)
      }
    } else {
      console.error('Subtask ID is undefined')
    }
  }

  useEffect(() => {
    setIsChecked(status === 'Enabled')
  }, [status])

  return (
    <div
      className={`w-[20rem] p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'}`}
    >
      <div className="flex items-center">
        <Checkbox
          id="terms"
          checked={isChecked}
          onCheckedChange={handleCheckboxChange}
        />
        <label
          htmlFor="terms"
          className={`ml-2 text-sm ${isChecked ? 'line-through text-gray-400' : ''}`}
        >
          {name}
        </label>
      </div>
    </div>
  )
}
