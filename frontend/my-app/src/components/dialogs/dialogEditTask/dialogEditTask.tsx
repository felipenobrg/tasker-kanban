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

interface DialogEditTaskProps {
  statusOption: { status: string; circleColor: string }[]
  initialDescription: string
  initialStatus: string
  id: number
  isOpen: boolean
  title: string
  onClose: () => void
  setDialogOpen: (isOpen: boolean) => void
  onUpdateTask: (id: number, description: string, status: string) => void
  handleDeleteTask?: (id: number) => void
}

export default function DialogEditTask(props: DialogEditTaskProps) {
  const {
    statusOption,
    initialDescription,
    initialStatus,
    id,
    isOpen,
    title,
    onClose,
    setDialogOpen,
    onUpdateTask,
    handleDeleteTask,
  } = props

  const { register, handleSubmit } = useForm()
  const [subtaskData, setSubtaskData] = useState<Subtasks[]>([])

  useEffect(() => {
    const fetchSubtaskData = async () => {
      try {
        const subtaskData = await GetSubtaskById({ id })
        setSubtaskData([subtaskData])
      } catch (error) {
        console.error('Error fetching subtask data:', error)
      }
    }

    fetchSubtaskData()
  }, [id])

  const onSubmit = async (formData: any) => {
    try {
      await UpdateTask({
        description: formData.dialogDescription,
        status: formData.dialogStatus,
        id,
      })
      onUpdateTask(id, formData.dialogDescription, formData.dialogStatus)
      setDialogOpen(false)
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  console.log('SUBSTASKS', subtaskData)

  return (
    <Dialog.Root modal open={isOpen} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0">
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </Dialog.Overlay>
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded shadow-md bg-gray-900 p-5 w-[30rem] flex flex-col gap-2 justify-center items-center z-50 overflow-y-auto">
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
            value={title}
          />
          <p className="text-sm mt-2">Editar descrição da Tarefa</p>
          <Input
            type="text"
            className="w-[20rem]"
            placeholder="Informe..."
            {...register('description')}
            value={initialDescription}
          />
          <p className="text-sm mt-2">Editar Sub Tarefa</p>
          {subtaskData &&
            subtaskData.map((item) => (
              <SubtaskCard name={item.name} key={item.ID} />
            ))}
          <p>Editar o Status da Tarefa</p>
          <Select value={initialStatus} {...register('dialogStatus')}>
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
