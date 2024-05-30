'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { useBoard } from '@/context/boardContext'
import PostTask from '@/lib/task/postTask'
import { Flag, Plus, X } from 'lucide-react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTask } from '@/context/taskContext'
import PostSubtask from '@/lib/subtasks/postSubtasks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTheme } from 'next-themes'
import { priorityOptions } from '@/components/board/board'
import getPriorityColor from '@/helpers/getPriorityColors'

interface DialogAddNewTaskProps {
  statusOption: { status: string; circleColor: string }[]
  isOpen: boolean
  onClose: () => void
}

export default function DialogAddNewTask(props: DialogAddNewTaskProps) {
  const queryClient = useQueryClient()
  const { statusOption, isOpen, onClose } = props
  const { register, handleSubmit, reset, setValue } = useForm()
  const { boardId } = useBoard()
  const [subTasks, setSubTasks] = useState([{ name: '' }])
  const { theme } = useTheme()
  const [taskId, setTaskId] = useState<number | null>(null)

  const { mutate: mutateTask } = useMutation({
    mutationFn: PostTask,
    onSuccess: (data) => {
      setTaskId(data.data.ID)
      console.log('DATA', data.data.ID)
      queryClient.invalidateQueries({ queryKey: ['board'] })
    },
  })

  const { mutate: mutateSubtask } = useMutation({
    mutationFn: PostSubtask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subtasks'] })
    },
  })

  const onSubmit = (data: FieldValues) => {
    try {
      const taskData = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        board_id: boardId,
      }
      mutateTask(taskData, {
        onSuccess: (task) => {
          if (task.id) {
            for (const subTask of subTasks) {
              if (subTask.name.trim() !== '') {
                const subTaskData = {
                  task_id: taskId,
                  name: subTask.name,
                  status: 'Disabled',
                }
                mutateSubtask(subTaskData)
              }
            }
          }
          reset()
          onClose()
          setSubTasks([{ name: '' }])
        },
      })
    } catch (error) {
      console.error('Error posting task:', error)
    }
  }

  const handleAddSubTask = () => {
    setSubTasks([...subTasks, { name: '' }])
  }

  const handleRemoveSubTask = (index: number) => {
    const updatedSubTasks = [...subTasks]
    updatedSubTasks.splice(index, 1)
    setSubTasks(updatedSubTasks)
  }

  const handleSubTaskChange = (index: number, value: string) => {
    const updatedSubTasks = [...subTasks]
    updatedSubTasks[index] = { name: value }
    setSubTasks(updatedSubTasks)
  }

  const handleSubmitButtonClick = () => {
    handleSubmit(onSubmit)()
  }

  return (
    <Dialog.Root
      onOpenChange={onClose}
      open={isOpen}
      defaultOpen={isOpen}
      modal
    >
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-90 z-50" />
      <Dialog.Content
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded shadow-md p-5 w-[30rem] flex flex-col gap-2 justify-center items-center z-50 overflow-auto ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200'
        }`}
      >
        <form className="flex flex-col gap-3 overflow-auto">
          <div className="flex justify-start">
            <h1 className="text-lg font-bold">Adicionar uma nova tarefa</h1>
          </div>
          <p className="text-sm mt-2">Título da Tarefa</p>
          <Input
            type="text"
            className="w-[20rem] mb-2"
            placeholder="e.g: Reunião de equipe semanal"
            {...register('title')}
          />
          <p className="text-sm mt-2">Descrição da Tarefa</p>
          <Input
            type="text"
            className="w-[20rem] mb-2"
            placeholder="e.g Discutir os objetivos e metas da semana com a equipe."
            {...register('description')}
          />
          <p className="text-sm mt-2">Prioridade da Tarefa</p>
          <Select
            onValueChange={(newValue) => {
              setValue('priority', newValue)
            }}
          >
            <SelectTrigger className="w-[20rem]">
              <SelectValue placeholder="e.g Baixa." />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((item, index) => (
                <SelectGroup key={index}>
                  <SelectItem
                    value={item.name}
                    className="flex items-center gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <Flag
                        size={18}
                        fill={getPriorityColor(item.name)}
                        color={getPriorityColor(item.name)}
                      />
                      {item.name}
                    </div>
                  </SelectItem>
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm mt-2">Checklist</p>
          {subTasks.map((subTask, index) => (
            <div key={index} className="flex items-center">
              <Input
                type="text"
                className="w-[17rem] mb-2 mr-2"
                placeholder="Adicionar uma nova checklist"
                value={subTask.name}
                onChange={(e) => handleSubTaskChange(index, e.target.value)}
              />
              <X
                className="w-[3rem] cursor-pointer"
                onClick={() => handleRemoveSubTask(index)}
              />
            </div>
          ))}
          <Button
            onClick={handleAddSubTask}
            className="flex flex-row items-center bg-indigo-500 hover:bg-indigo-600 text-white w-[20rem]"
            type="button"
          >
            <Plus color="white" size={18} /> Adicionar Checklist
          </Button>
          <p className="text-sm mt-2">Status</p>
          <Select
            onValueChange={(newValue) => {
              setValue('status', newValue)
            }}
          >
            <SelectTrigger className="w-[20rem]">
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {statusOption.map((item, index) => (
                  <SelectItem key={index} value={item.status}>
                    {item.status}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            onClick={handleSubmitButtonClick}
            className="mt-6 w-[20rem]"
            type="button"
          >
            Enviar
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
