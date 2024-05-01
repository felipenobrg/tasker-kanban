import * as React from 'react'
import {
  Menu,
  Link,
  HomeIcon,
  Search,
  Sun,
  MoonIcon,
  SunIcon,
} from 'lucide-react'
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
import { ChangeEvent } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Plus } from 'lucide-react'
import { useDialog } from '@/context/dialogContext'

interface HeaderProps {
  toggleTheme: () => void
}

export default function Header(props: HeaderProps) {
  const { setTheme } = useTheme()
  const { setFilterValue } = useFilter()
  const { setDialogOpen } = useDialog()
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value)
  }

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  return (
    <Dialog.Root>
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
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
        <div className="w-full flex-1">
          <form>
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
        </div>
        <Dialog.Trigger asChild>
          <Button
            className="w-48 p-3 mb-5 bg-gray-800 text-white hover:bg-slate-900 flex gap-2 items-center"
            onClick={handleDialogOpen}
          >
            Adicionar novo item <Plus size={20} />
          </Button>
        </Dialog.Trigger>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Mudar tema</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              Escuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              Padrão do Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </Dialog.Root>
  )
}
