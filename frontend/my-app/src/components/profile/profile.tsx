import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import defaultProfile from '../../assets/defaultProfile.jpg'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { useState } from 'react'
import { signOut } from 'next-auth/react'
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@radix-ui/react-dropdown-menu'
import { UserX } from 'lucide-react'

export default function Profile() {
  const [showDropdown, setShowDropdown] = useState(false)

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  const handleAvatarClick = () => {
    toggleDropdown()
  }

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer w-9 h-9" onClick={handleAvatarClick}>
          <Image src={defaultProfile} alt="Foto de usuário padrão" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      {showDropdown && (
        <DropdownMenuContent className="flex w-40 h-10 justify-start items-center">
          <Button onClick={handleLogout}>
            <DropdownMenuLabel className="flex items-center gap-2">
              Sair da conta <UserX size={15} />
            </DropdownMenuLabel>
          </Button>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
