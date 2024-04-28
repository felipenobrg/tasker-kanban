'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '../ui/button'
import BoardCard from './boardCard'
import { useState } from 'react'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export default function Board() {
  const [dataArray, setDataArray] = useState([
    { value: 'Comer', status: '', id: 1 },
    { value: 'Estudar', status: '', id: 2 },
    { value: 'Correr', status: '', id: 3 },
  ])

  const [namesArray] = useState(['Backlog', 'Em andamento', 'Feito'])

  const [dialogDescription, setDialogDescription] = useState('')
  const [dialogStatus, setDialogStatus] = useState('')

  const generateUniqueId = () => {
    const maxId = Math.max(...dataArray.map((item) => item.id), 0)
    return maxId + 1
  }

  const addItem = () => {
    const newItem = {
      value: 'New Value',
      id: generateUniqueId(),
      description: dialogDescription,
      status: dialogStatus,
    }
    setDataArray([...dataArray, newItem])
    setDialogDescription('')
    setDialogStatus('')
  }

  return (
    <Dialog.Root>
      <main className="flex flex-1 gap-4 p-4 lg:gap-6 lg:p-6 relative">
        <div className="flex flex-col items-center gap-4">
          <Dialog.Trigger asChild>
            <Button className="w-1/4 p-3 mb-5 bg-gray-800 text-white hover:bg-slate-900">
              Adicionar novo item
            </Button>
          </Dialog.Trigger>
          <div className="flex flex-row gap-3">
            {dataArray.map((item, index) => (
              <BoardCard
                key={item.id}
                name={namesArray[index]}
                data={dataArray}
                setData={setDataArray}
              />
            ))}
          </div>
        </div>
        <Dialog.Overlay className="fixed inset-0 backdrop-filter backdrop-blur-sm bg-opacity-30 bg-black">
          <Dialog.Content className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded shadow-md bg-gray-900 p-5 w-1/4 h-1/2 flex flex-col gap-2 justify-center">
            <form className="flex flex-col gap-3" onSubmit={addItem}>
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
                    <SelectItem value="Backlog">Backlog</SelectItem>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Feito">Feito</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button type="submit" className="mt-3">
                Enviar
              </Button>
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </main>
    </Dialog.Root>
  )
}
