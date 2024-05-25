import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import { ChangeEvent } from 'react'

interface InputProps {
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function HeaderInput(props: InputProps) {
  const { handleInputChange } = props
  return (
    <div className="hidden w-full items-center sm:flex">
      <form className="w-full">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar tarefas"
            className="max-w-96 appearance-none bg-background pl-8 shadow-none"
            onChange={handleInputChange}
          />
        </div>
      </form>
    </div>
  )
}
