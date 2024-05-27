import Link from 'next/link'
import GithubIcon from '../../assets/githubIcon.png'
import { useTheme } from 'next-themes'
import Image from 'next/image'

export default function GithubButton() {
  const { theme } = useTheme()
  return (
    <Link
      href="https://github.com/felipenobrg/tasker"
      className="flex items-center justify-center bg-white h-14 w-48 rounded-lg mt-6 space-x-2"
    >
      <p
        className={`text-sm text-gray-800 font-semibold ${theme === 'dark' ? 'text-base' : 'text-gray-800'}`}
      >
        Acesse o repositório
      </p>
      <Image src={GithubIcon} alt="Logo do Github" className="w-5 h-5" />
    </Link>
  )
}
