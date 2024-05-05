'use client'

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

interface DialogTaskProps {
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

export default function DialogTask(props: DialogTaskProps) {
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
  const [dialogDescription, setDialogDescription] = useState(initialDescription)
  const [dialogStatus, setDialogStatus] = useState(initialStatus)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await UpdateTask({
        description: dialogDescription,
        status: dialogStatus,
        id,
      })
      onUpdateTask(id, dialogDescription, dialogStatus)
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
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 rounded-lg shadow-md bg-gray-900 p-5 w-96 h-96 flex flex-col gap-2 justify-center">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex justify-between">
            <h1 className="text-lg font-bold">Edição da Tarefa</h1>
            <MenubarTask
              id={id}
              handleDeleteTask={() => handleDeleteTask?.(id)}
            />
          </div>
          <p className="text-sm mt-2">Editar descrição da Tarefa</p>
          <Input
            type="text"
            className="w-full"
            placeholder="Informe..."
            value={dialogDescription}
            onChange={(e) => setDialogDescription(e.target.value)}
          />
          <p>Editar o status da Tarefa</p>
          <Select
            value={dialogStatus}
            onValueChange={(value) => setDialogStatus(value)}
          >
            <SelectTrigger className="w-full">
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
