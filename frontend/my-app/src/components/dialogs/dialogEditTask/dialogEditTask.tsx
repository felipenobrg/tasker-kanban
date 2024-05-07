'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { useState } from 'react'
import UpdateTask from '@/lib/task/updateTask'
import MenubarTask from '../menubarTask'
import SubtaskCard from './subtaskCards'

interface DialogEditTaskProps {
  statusOption: { status: string; circleColor: string }[]
  initialDescription: string
  initialStatus: string
  id: number
  isOpen: boolean
  onClose: () => void
  setDialogOpen: (isOpen: boolean) => void
  onUpdateTask: (id: number, description: string, status: string) => void
  handleDeleteTask?: (id: number) => void
}

const schema = z.object({
  description: z.string(),
  status: z.string(),
})

export default function DialogEditTask(props: DialogEditTaskProps) {
  const {
    statusOption,
    initialDescription,
    initialStatus,
    id,
    isOpen,
    onClose,
    setDialogOpen,
    onUpdateTask,
    handleDeleteTask,
  } = props

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const [dialogDescription, setDialogDescription] = useState(initialDescription)
  const [dialogStatus, setDialogStatus] = useState(initialStatus)

  const onSubmit = async (data: { description: string; status: string }) => {
    try {
      await UpdateTask({
        description: data.description,
        status: data.status,
        id,
      })
      onUpdateTask(id, data.description, data.status)
      setDialogDescription('')
      setDialogStatus('')
      setDialogOpen(false)
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  return (
    <Dialog.Root modal open={isOpen} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0">
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </Dialog.Overlay>{' '}
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded shadow-md bg-gray-900 p-5 w-[30rem] flex flex-col gap-2 justify-center items-center z-50 overflow-y-auto">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between">
            <h1 className="text-lg font-bold">Edição da Tarefa</h1>
            <MenubarTask
              id={id}
              handleDeleteTask={() => handleDeleteTask?.(id)}
            />
          </div>
          <p className="text-sm mt-2">Editar Sub Tarefas</p>
          <Input
            type="text"
            className="w-[20rem]"
            placeholder="Informe..."
            {...register('description')}
            value={dialogDescription}
            onChange={(e) => setDialogDescription(e.target.value)}
          />
          <p className="text-sm mt-2">Editar descrição da Tarefa</p>
          <SubtaskCard />
          {errors.description && (
            <span className="text-red-500">Este campo é obrigatório</span>
          )}
          <p>Editar o Status da Tarefa</p>
          <Select
            value={dialogStatus}
            onValueChange={(value) => setDialogStatus(value)}
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
          {errors.status && (
            <span className="text-red-500">Este campo é obrigatório</span>
          )}
          <Button type="submit" className="mt-3">
            Enviar
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
