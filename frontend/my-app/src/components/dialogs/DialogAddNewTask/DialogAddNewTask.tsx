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
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldValues, useForm } from 'react-hook-form'
import { z } from 'zod'

interface DialogAddNewTaskProps {
  statusOption: string[]
  isOpen: boolean
  onClose: () => void
}

const schema = z.object({
  title: z.string(),
  description: z.string(),
  subTasks: z.array(z.string()),
  status: z.string().min(1),
})

export default function DialogAddNewTask(props: DialogAddNewTaskProps) {
  const { statusOption, isOpen, onClose } = props
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })
  const [subTasks, setSubTasks] = useState([{ name: '' }])
  console.log('substasks', subTasks)
  const { boardId } = useBoard()

  const onSubmit = async (data: FieldValues) => {
    try {
      if (boardId === null) {
        throw new Error("boardId não pode ser null");
      }
        const taskData = {
          title: data.title,
          board_id: boardId,
          description: data.description,
          status: data.status,
          subtasks: subTasks.map((subTask) => ({
            name: subTask.name,
            status: 'Enabled',
          })),
        }
        console.log('taskData', taskData);
        await PostTask(taskData)
        setSubTasks([])
    } catch (error) {
      console.error('Error posting task:', error)
    }
  }
  const handleAddSubTask = () => {
    setSubTasks([...subTasks, { name: '' }])
  }

  const handleRemoveSubTask = (index: number) => {
    const updatedSubTasks = [...subTasks]
    updatedSubTasks.splice(index, 1)
    setSubTasks(updatedSubTasks)
  }

  const handleSubTaskChange = (index: number, value: string) => {
    const updatedSubTasks = [...subTasks]
    updatedSubTasks[index] = { name: value }
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
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded shadow-md bg-gray-900 p-5 w-[30rem] flex flex-col gap-2 justify-center items-center z-50 overflow-">
        <form
          className="flex flex-col gap-3"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex justify-start">
            <h1 className="text-lg font-bold">Adicionar uma nova tarefa</h1>
          </div>
          <p className="text-sm mt-2">Título da Tarefa</p>
          <Input
            type="text"
            className="w-[20rem] mb-2"
            placeholder="e.g: Reunião de equipe semanal"
            {...register('title')}
            required
          />
          {errors.title && (
            <span className="text-red-500">Este campo é obrigatório</span>
          )}
          <p className="text-sm mt-2">Descrição da Tarefa</p>
          <Input
            type="text"
            className="w-[20rem] mb-2"
            placeholder="e.g Discutir os objetivos e metas da semana com a equipe."
            {...register('description')}
            required
          />
          {errors.description && (
            <span className="text-red-500">Este campo é obrigatório</span>
          )}
          <p className="text-sm mt-2">Sub tarefas</p>
          {subTasks.map((subTask, index) => (
            <div key={index} className="flex items-center">
              <Input
                type="text"
                className="w-[17rem] mb-2 mr-2"
                placeholder="Adicionar uma sub tarefa"
                value={subTask.name}
                onChange={(e) => handleSubTaskChange(index, e.target.value)}
              />
              <X
                className="w-[3rem]"
                onClick={() => handleRemoveSubTask(index)}
              />
            </div>
          ))}
          <Button
            onClick={handleAddSubTask}
            className="flex flex-row items-center bg-indigo-500 hover:bg-indigo-600  text-white w-[20rem]"
            type="button"
          >
            <Plus color="white" size={18} /> Adicionar Sub Tarefas
          </Button>
          <p className="text-sm mt-2">Status</p>
          <Select {...register('status')} required>
            <SelectTrigger className="w-[20rem]">
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent className="w-[20rem]">
              <SelectGroup>
                {statusOption.map((status, index) => (
                  <SelectItem key={index} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button type="submit" className="mt-3 w-[20rem]">
            Enviar
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
