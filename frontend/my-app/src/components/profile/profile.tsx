import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import defaultProfile from '../../assets/defaultProfile.jpg'
import Image from 'next/image'

export default function Profile() {
  return (
    <Avatar className="cursor-pointer w-9 h-9">
      <Image src={defaultProfile} alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}
