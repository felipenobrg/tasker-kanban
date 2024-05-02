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
import { useDialog } from '@/context/dialogContext'
import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import MenubarTask from '../menubarTask'
import { useBoardId } from '@/context/boardIdContext'

interface DialogBoardProps {
  statusOption: { status: string; circleColor: string }[]
  sendTask: (description: string, status: string) => void
}

export default function DialogBoard(props: DialogBoardProps) {
  const { statusOption, sendTask } = props
  const [dialogDescription, setDialogDescription] = useState('')
  const [dialogStatus, setDialogStatus] = useState('')
  const { isOpen, onClose } = useDialog()
  const { boardId } = useBoardId()
  console.log('BOARDID', boardId)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (boardId !== null) {
        sendTask(boardId, dialogDescription, dialogStatus)
        setDialogDescription('')
        setDialogStatus('')
      } else {
        console.error('boardId is null')
      }
    } catch (error) {
      console.error('Error posting task:', error)
    }
  }

  return (
    <Dialog.Root
      onOpenChange={onClose}
      modal
      open={isOpen}
      defaultOpen={isOpen}
    >
      <Dialog.Overlay className="fixed inset-0">
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </Dialog.Overlay>
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded shadow-md bg-gray-900 p-5 w-80 h-96 flex flex-col gap-2 justify-center items-center">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex items-center gap-3 justify-between">
            <h1 className="text-base font-bold">Adicionar uma nova tarefa</h1>
            <MenubarTask />
          </div>
          <p className="text-sm mt-2">Descrição da Tarefa</p>
          <Input
            type="text"
            className="w-full mb-2"
            placeholder="e.g Estudar matematica aplicada."
            value={dialogDescription}
            onChange={(e) => setDialogDescription(e.target.value)}
          />
          <p className="text-sm">Status da Tarefa</p>
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
          <Button type="submit" className="mt-3 w-full">
            Enviar
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
