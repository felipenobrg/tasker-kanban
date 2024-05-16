'use client'

import * as React from 'react'
import { Menu, Link, HomeIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { SheetTrigger, SheetContent, Sheet } from '../ui/sheet'
import { useFilter } from '@/context/filterContext'
import { ChangeEvent, useState } from 'react'
import { Plus } from 'lucide-react'
import AlertDialog from './alertDialog'
import { useBoard } from '@/context/boardContext'
import HeaderInput from './headerInput'
import DropdownDeleteBoard from './dropdownDeleteBoard'
import { statusOption } from '@/types/statusOption'
import Profile from '../profile/profile'
import DialogAddNewTask from '../dialogs/dialogAddNewTask/dialogAddNewTask'

export default function Header() {
  const { setFilterValue } = useFilter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const { boardName, setBoardName } = useBoard()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value)
  }

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
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Mudar menu de navegação</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="#"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <HomeIcon className="h-5 w-5" />
              Tasker Board
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="mr-8">
        <h1 className="text-lg font-bold">{boardName}</h1>
      </div>
      <HeaderInput handleInputChange={handleInputChange} />
      <div className="flex items-center ml-5">
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
