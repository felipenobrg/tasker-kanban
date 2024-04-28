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
import { useState } from 'react'

interface DialogBoardProps {
  statusOptions: string[]
}

export default function DialogBoard(props: DialogBoardProps) {
  const { statusOptions } = props
  const [dialogDescription, setDialogDescription] = useState('')
  const [dialogStatus, setDialogStatus] = useState('')
  return (
    <Dialog.Overlay className="fixed inset-0 backdrop-filter backdrop-blur-sm bg-opacity-30 bg-black">
      <Dialog.Content className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded shadow-md bg-gray-900 p-5 w-1/4 h-1/2 flex flex-col gap-2 justify-center">
        <form className="flex flex-col gap-3">
          <Dialog.Title>Descrição da Tarefa</Dialog.Title>
          <Input
            type="text"
            placeholder="Informe..."
            value={dialogDescription}
            onChange={(e) => setDialogDescription(e.target.value)}
          />
          <Dialog.Title>Status da Tarefa</Dialog.Title>
          <Select
            value={dialogStatus}
            onValueChange={(value) => setDialogStatus(value)}
          >
            <SelectTrigger className="w-[180px]">
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
          <Button type="submit" className="mt-3">
            Enviar
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Overlay>
  )
}
