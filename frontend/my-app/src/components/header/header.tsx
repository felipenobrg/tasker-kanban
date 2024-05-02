'use client'
import * as React from 'react'
import { Menu, Link, HomeIcon, Search, EllipsisVertical } from 'lucide-react'
import { Button } from '../ui/button'
import { SheetTrigger, SheetContent, Sheet } from '../ui/sheet'
import { Input } from '../ui/input'
import { useTheme } from 'next-themes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { useFilter } from '@/context/filterContext'
import { ChangeEvent, useState } from 'react'
import { Plus } from 'lucide-react'
import AlertDialog from './alertDialog'
import DeleteBoard from '@/lib/boards/deleteBoard'
import { useBoard } from '@/context/boardContext'
import ChangeThemeButton from './changeThemeButton'

interface HeaderProps {
  toggleTheme: () => void
}

export default function Header(props: HeaderProps) {
  const { setFilterValue } = useFilter()
  const { boardId } = useBoard()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value)
  }

  const handleDialogOpen = () => {
    setIsDialogOpen(true)
  }

  const handleCancelDelete = () => {
    setIsDialogOpen(false)
  }

  const handleEllipsisClick = () => {
    setIsDialogOpen(true)
  }

  const handleDeleteConfirmation = () => {
    setIsDialogOpen(true)
  }

  const handleDeleteBoard = async () => {
    if (boardId !== null) {
      await DeleteBoard({ id: boardId })
      setIsDialogOpen(false)
    } else {
      console.error('Cannot delete board: boardId is null')
    }
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
      <div className="w-full flex flex-1 items-center">
        <form className="w-full">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar campos..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
              onChange={handleInputChange}
            />
          </div>
        </form>
        <div>
          <Button
            className="w-48 p-3 bg-indigo-500 text-white hover:bg-indigo600 flex gap-2 items-center"
            onClick={handleDialogOpen}
          >
            <Plus size={18} /> Adicionar novo item
          </Button>
        </div>
        <div className="flex items-center"></div>
        <DropdownMenu>
          <DropdownMenuTrigger className="justify-end">
            <Button variant="ghost" onClick={handleEllipsisClick}>
              <EllipsisVertical size={18} className="cursor-pointer" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleDeleteConfirmation}>
              <p className="text-red-500">Deletar tarefa</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleCancelDelete={handleCancelDelete}
          handleDeleteBoard={handleDeleteBoard}
        />
      </div>
      <ChangeThemeButton />
    </header>
  )
}
