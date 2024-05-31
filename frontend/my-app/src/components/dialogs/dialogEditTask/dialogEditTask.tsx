'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import UpdateTask from '@/lib/task/updateTask'
import MenubarTask from '../menubarTask'
import SubtaskCard from './subtaskCards'
import GetSubtaskById from '@/lib/subtasks/getSubtaskById'
import { Subtasks } from '@/types/subtasks'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import Spinner from '@/assets/spinner'
import { useTheme } from 'next-themes'
import { Flag } from 'lucide-react'
import getPriorityColor from '@/helpers/getPriorityColors'

interface FormDataProps {
  title: string
  description: string
  dialogStatus: string
  priority: string
}

interface DialogEditTaskProps {
  statusOption: { status: string; circleColor: string }[]
  initialDescription: string
  initialStatus: string
  id: number
  taskId: number
  isOpen: boolean
  title: string
  priority: string
  priorityOptions: { name: string; color: string }[]
  onClose: () => void
  setDialogOpen: (isOpen: boolean) => void
  handleDeleteTask?: (id: number) => void
}

export default function DialogEditTask(props: DialogEditTaskProps) {
  const queryClient = useQueryClient()
  const { theme } = useTheme()

  const {
    statusOption,
    id,
    isOpen,
    taskId,
    initialStatus,
    priority,
    priorityOptions,
    onClose,
    setDialogOpen,
    handleDeleteTask,
  } = props
  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: props.title,
      description: props.initialDescription,
      dialogStatus: props.initialStatus,
      priority: props.priority,
    },
  })

  const [subtaskData, setSubtaskData] = useState<Subtasks[]>([])
  const { data: subtasks, isLoading } = useQuery({
    queryKey: ['subtasks', taskId],
    queryFn: () => GetSubtaskById({ id: taskId }),
    retry: false,
  })

  const { mutate: mutateTasks } = useMutation({
    mutationFn: UpdateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    },
  })

  useEffect(() => {
    if (subtasks) {
      setSubtaskData(subtasks)
    }
  }, [subtasks, isLoading])

  const onSubmit = (formData: FormDataProps) => {
    try {
      mutateTasks({
        title: formData.title,
        description: formData.description,
        status: formData.dialogStatus,
        priority: formData.priority,
        id,
      })
      reset({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dialogStatus: formData.dialogStatus,
      })
      setDialogOpen(false)
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  if (isLoading || !subtaskData) return <Spinner />

  return (
    <Dialog.Root modal open={isOpen} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-90 z-50" />
      <Dialog.Content
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded shadow-md p-6 w-[30rem] flex flex-col gap-2 justify-center items-center z-50 overflow-y-auto ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200'
        }`}
      >
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between">
            <h1 className="text-lg font-bold">Edição da Tarefa</h1>
            <MenubarTask
              id={id}
              handleDeleteTask={() => handleDeleteTask?.(id)}
            />
          </div>
          <p className="text-sm mt-2">Editar título da Tarefa</p>
          <Input
            type="text"
            className="w-[20rem]"
            placeholder="Informe..."
            {...register('title')}
          />
          <p className="text-sm mt-2">Editar descrição da Tarefa</p>
          <Input
            type="text"
            className="w-[20rem]"
            placeholder="Informe..."
            {...register('description')}
          />
          <p className="text-sm mt-2">Editar prioridade da Tarefa</p>
          <Select
            onValueChange={(newValue) => {
              setValue('priority', newValue)
            }}
            defaultValue={priority}
          >
            <SelectTrigger className="w-[20rem]">
              <SelectValue placeholder="Selecione uma prioridade" />
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
          <p className="text-sm mt-2">Editar Checklist</p>
          {subtaskData === null || subtaskData.length === 0 ? (
            <p className="text-sm mt-2 text-gray-400">
              Nenhuma Checklist disponível
            </p>
          ) : (
            <>
              {subtaskData.map((item) => (
                <SubtaskCard
                  name={item.name}
                  subtaskId={item.ID}
                  key={item.ID}
                  status={item.status}
                />
              ))}
            </>
          )}

          <p className="text-sm mt-2">Editar o Status da Tarefa</p>
          <Select
            onValueChange={(newValue) => {
              setValue('dialogStatus', newValue)
            }}
            defaultValue={initialStatus}
          >
            <SelectTrigger className="w-[20rem]">
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {statusOption.map(({ status }, index) => (
                  <SelectItem key={index} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button type="submit" className="mt-3">
            Enviar
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
