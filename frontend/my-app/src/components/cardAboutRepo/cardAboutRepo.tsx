import { useTheme } from 'next-themes'
import { Card, CardContent } from '../ui/card'
import GithubButton from '../ui/githubButton'

interface CardAboutRepoProps {
  title: string
  description: string
}

export default function CardAboutRepo(props: CardAboutRepoProps) {
  const { title, description } = props
  const { theme } = useTheme()
  return (
    <Card className="flex flex-col justify-center bg-blue-900 h-[17rem] w-full sm:w-[25rem] sm:h-[40rem]  border-none rounded-none sm:rounded-l-none sm:rounded-r-xl">
      <CardContent className="w-80">
        <h1
          className={`text-xl sm:text-3xl text-start font-jakarta font-bold mb-2 ${theme === 'dark' ? 'text-base' : 'text-white'}`}
        >
          {title}
        </h1>
        <p
          className={`text-sm text-gray-100 text-start font-jakarta font-normal mb-2 ${theme === 'dark' ? 'text-base' : 'text-white'}`}
        >
          {description}
        </p>
        <GithubButton />
      </CardContent>
    </Card>
  )
}
