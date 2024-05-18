import { SunIcon, MoonIcon } from 'lucide-react'
import { Switch } from '../ui/switch'
import { useTheme } from 'next-themes'
import { SetStateAction } from 'react'

export default function ChangeThemeButton() {
  const { setTheme, theme } = useTheme()

  const handleThemeChange = (selectedTheme: SetStateAction<string>) => {
    setTheme(selectedTheme)
  }

  return (
    <div
      className={`flex justify-center items-center p-3 rounded-md w-10/12 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-500'
      }`}
    >
      <SunIcon
        className={`h-6 w-6 text-gray-200 ${
          theme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
        } transition-transform`}
      />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={(checked) =>
          handleThemeChange(checked ? 'dark' : 'light')
        }
        className="mr-2 ml-2"
      />
      <MoonIcon
        className={`h-6 w-6 text-gray-200 ${
          theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
        } transition-transform`}
      />
      <span className="sr-only">Mudar tema</span>
    </div>
  )
}
