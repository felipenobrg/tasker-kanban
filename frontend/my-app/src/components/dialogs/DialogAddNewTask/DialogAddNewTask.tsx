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
import { Plus, X } from 'lucide-react'

interface DialogAddNewTaskProps {
  statusOption: string[]
  isOpen: boolean
  onClose: () => void
}

export default function DialogAddNewTask(props: DialogAddNewTaskProps) {
  const { statusOption, isOpen, onClose } = props
  const [dialogDescription, setDialogDescription] = useState('')
  const [dialogStatus, setDialogStatus] = useState('')
  const [subTasks, setSubTasks] = useState<string[]>([])
  const { boardId } = useBoard()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (boardId !== null) {
        await PostTask({
          board_id: boardId,
          description: dialogDescription,
          status: dialogStatus,
        })
        setDialogDescription('')
        setDialogStatus('')
        setSubTasks([])
      } else {
        console.error('boardId is null')
      }
    } catch (error) {
      console.error('Error posting task:', error)
    }
  }

  const handleAddSubTask = () => {
    setSubTasks([...subTasks, ''])
  }

  const handleSubTaskChange = (index: number, value: string) => {
    const updatedSubTasks = [...subTasks]
    updatedSubTasks[index] = value
    setSubTasks(updatedSubTasks)
  }

  const handleRemoveSubTask = (index: number) => {
    const updatedSubTasks = [...subTasks]
    updatedSubTasks.splice(index, 1)
    setSubTasks(updatedSubTasks)
  }

  return (
    <Dialog.Root
      onOpenChange={onClose}
      open={isOpen}
      defaultOpen={isOpen}
      modal
    >
      <Dialog.Overlay className="fixed inset-0">
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </Dialog.Overlay>{' '}
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded shadow-md bg-gray-900 p-5 w-[30rem] flex flex-col gap-2 justify-center items-center z-50 overflow-auto">
        <form className="flex flex-col gap-3 " onSubmit={handleSubmit}>
          <div className="flex justify-start">
            <h1 className="text-lg font-bold">Adicionar uma nova tarefa</h1>
          </div>
          <p className="text-sm mt-2">Título da Tarefa</p>
          <Input
            type="text"
            className="w-[20rem] mb-2"
            placeholder="e.g: Reunião de equipe semanal"
            value={dialogDescription}
            onChange={(e) => setDialogDescription(e.target.value)}
            required
          />
          <p className="text-sm mt-2">Descrição da Tarefa</p>
          <Input
            type="text"
            className="w-[20rem] mb-2"
            placeholder="e.g Discutir os objetivos e metas da semana com a equipe."
            value={dialogDescription}
            onChange={(e) => setDialogDescription(e.target.value)}
            required
          />
          <p className="text-sm mt-2">Sub tarefas</p>
          {subTasks.map((subTask, index) => (
            <div key={index} className="flex items-center">
              <Input
                type="text"
                className="w-[20rem] mb-2 mr-2"
                placeholder="Adicionar uma sub tarefa"
                value={subTask}
                onChange={(e) => handleSubTaskChange(index, e.target.value)}
              />
              <Button
                type="button"
                onClick={() => handleRemoveSubTask(index)}
                className="text-gray-500"
                variant="ghost"
              >
                <X />
              </Button>
            </div>
          ))}
          <Button
            onClick={handleAddSubTask}
            className="flex flex-row items-center bg-indigo-500 text-white"
          >
            <Plus color="white" size={18} /> Adicionar Sub Tarefas
          </Button>
          <p className="text-sm mt-2">Status</p>
          <Select
            value={dialogStatus}
            onValueChange={(value) => setDialogStatus(value)}
            required
          >
            <SelectTrigger className="w-full">
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
          <Button type="submit" className="mt-3 w-full">
            Enviar
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
