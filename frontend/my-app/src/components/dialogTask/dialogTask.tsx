'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useEffect, useState } from 'react'
import UpdateTask from '@/lib/updateTask'

interface DialogTaskProps {
  statusOption: string[]
  initialDescription: string
  initialStatus: string
  id: number
  setDialogOpen: (isOpen: boolean) => void
  onUpdateTask: (id: number, description: string, status: string) => void
}

export default function DialogTask(props: DialogTaskProps) {
  const {
    statusOption,
    initialDescription,
    initialStatus,
    id,
    setDialogOpen,
    onUpdateTask,
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
      window.location.reload()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  return (
    <Dialog.Overlay className="fixed inset-0 backdrop-filter backdrop-blur-sm bg-opacity-30 bg-black">
      <Dialog.Content className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded shadow-md bg-gray-900 p-5 w-1/4 h-1/2 flex flex-col gap-2 justify-center">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Dialog.Title>Editar descrição da Tarefa</Dialog.Title>
          <Input
            type="text"
            className="w-4/5"
            placeholder="Informe..."
            value={dialogDescription}
            onChange={(e) => setDialogDescription(e.target.value)}
          />
          <Dialog.Title>Editar o status da Tarefa</Dialog.Title>
          <Select
            value={dialogStatus}
            onValueChange={(value) => setDialogStatus(value)}
          >
            <SelectTrigger className="w-4/5">
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {statusOption.map((status, index) => (
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
    </Dialog.Overlay>
  )
}
