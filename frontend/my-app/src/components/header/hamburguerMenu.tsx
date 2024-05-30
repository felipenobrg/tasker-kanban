import { Button } from '../ui/button'
import { Sheet, SheetTrigger, SheetContent } from '../ui/sheet'
import { Menu } from 'lucide-react'

export default function HamburguerMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Mudar menu de navegação</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col"></SheetContent>
    </Sheet>
  )
}
