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

interface DialogBoardProps {
  statusOptions: string[]
  setDialogOpen: (isOpen: boolean) => void
  sendTask: (description: string, status: string) => void
}

export default function DialogBoard(props: DialogBoardProps) {
  const { statusOptions, setDialogOpen, sendTask } = props
  const [dialogDescription, setDialogDescription] = useState('')
  const [dialogStatus, setDialogStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      sendTask(dialogDescription, dialogStatus)
      setDialogDescription('')
      setDialogStatus('')
      setDialogOpen(false)
    } catch (error) {
      console.error('Error posting task:', error)
    }
  }

  return (
    <Dialog.Overlay className="fixed inset-0 backdrop-filter backdrop-blur-sm bg-opacity-30 bg-black">
      <Dialog.Content className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded shadow-md bg-gray-900 p-5 w-80 h-80 flex flex-col gap-2 justify-center items-center">
        <form
          className="flex flex-col justify-center items-center gap-3"
          onSubmit={handleSubmit}
        >
          <Dialog.Title>Descrição da Tarefa</Dialog.Title>
          <Input
            type="text"
            className="w-11/12"
            placeholder="Informe..."
            value={dialogDescription}
            onChange={(e) => setDialogDescription(e.target.value)}
          />
          <Dialog.Title>Status da Tarefa</Dialog.Title>
          <Select
            value={dialogStatus}
            onValueChange={(value) => setDialogStatus(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {statusOptions.map((status, index) => (
                  <SelectItem key={index} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button type="submit" className="mt-3 w-full">
            Enviar
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Overlay>
  )
}
