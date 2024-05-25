'use client'

import * as React from 'react'
import { Button } from '../ui/button'
import { useFilter } from '@/context/filterContext'
import { ChangeEvent, useState } from 'react'
import { Plus } from 'lucide-react'
import AlertDialog from './alertDialog'
import { useBoard } from '@/context/boardContext'
import HeaderInput from '../board/boardInput'
import DropdownDeleteBoard from './dropdownDeleteBoard'
import { statusOption } from '@/types/statusOption'
import Profile from '../profile/profile'
import DialogAddNewTask from '../dialogs/dialogAddNewTask/dialogAddNewTasks'
import HamburguerMenu from './hamburguerMenu'

export default function Header() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const { boardName, setBoardName } = useBoard()

  const handleDialogOpen = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setIsAlertOpen(false)
  }

  const handleEllipsisClick = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleDeleteConfirmation = () => {
    setIsAlertOpen(true)
  }

  const handleCloseDialogBoard = () => {
    setIsDialogOpen(false)
  }

  return (
    <header className="flex justify-start h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <HamburguerMenu />
      <div className="flex items-center ml-5 sm:w-fit w-full">
        <div>
          <Button
            className="w-48 p-3 bg-indigo-500 text-white hover:bg-indigo600 flex gap-2 items-center"
            onClick={handleDialogOpen}
          >
            <Plus size={18} /> Adicionar nova Tarefa
          </Button>
        </div>
        <DialogAddNewTask
          onClose={handleCloseDialogBoard}
          isOpen={isDialogOpen}
          statusOption={statusOption}
        />
        <DropdownDeleteBoard
          handleEllipsisClick={handleEllipsisClick}
          handleDeleteConfirmation={handleDeleteConfirmation}
        />
        <AlertDialog
          boardName={boardName}
          isDialogOpen={isAlertOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleCancelDelete={handleCloseDialog}
          setIsAlertOpen={setIsAlertOpen}
          setBoardName={setBoardName}
        />
        <Profile />
      </div>
    </header>
  )
}
