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
import { FieldValues, useForm } from 'react-hook-form'
import { useTask } from '@/context/taskContext'
import PostSubtask from '@/lib/subtasks/postSubtasks'

interface DialogAddNewTaskProps {
  statusOption: string[]
  isOpen: boolean
  onClose: () => void
}

export default function DialogAddNewTask(props: DialogAddNewTaskProps) {
  const { statusOption, isOpen, onClose } = props
  const { register, handleSubmit, reset } = useForm()
  const [subTasks, setSubTasks] = useState([{ name: '' }])
  const { boardId } = useBoard()
  const { taskId } = useTask()
  console.log('TASKID', taskId)

  const onSubmit = async (data: FieldValues) => {
    try {
      const taskData = {
        title: data.title,
        description: data.description,
        status: data.status,
        board_id: boardId,
      }
      const mainTaskResponse = await PostTask(taskData)
      if (!mainTaskResponse) {
        return
      }
      for (const subTask of subTasks) {
        if (subTask.name.trim() !== '') {
          const subTaskData = {
            task_id: taskId,
            name: subTask.name,
            status: 'Enabled',
          }
          await PostSubtask(subTaskData)
        }
      }
      reset()
      onClose()
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

  const handleSubmitButtonClick = () => {
    handleSubmit(onSubmit)()
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
        <form className="flex flex-col gap-3 overflow-auto">
          <div className="flex justify-start">
            <h1 className="text-lg font-bold">Adicionar uma nova tarefa</h1>
          </div>
          <p className="text-sm mt-2">Título da Tarefa</p>
          <Input
            type="text"
            className="w-[20rem] mb-2"
            placeholder="e.g: Reunião de equipe semanal"
            {...register('title')}
          />
          <p className="text-sm mt-2">Descrição da Tarefa</p>
          <Input
            type="text"
            className="w-[20rem] mb-2"
            placeholder="e.g Discutir os objetivos e metas da semana com a equipe."
            {...register('description')}
          />
          <p className="text-sm mt-2">Checklist</p>
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
          <Select {...register('status')}>
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
          <Button
            onClick={handleSubmitButtonClick}
            className="mt-6 w-[20rem]"
            type="button"
          >
            Enviar
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
