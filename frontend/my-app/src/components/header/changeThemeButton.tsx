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
    <div className="flex items-center">
      <Switch
        checked={theme === 'dark'}
        onChange={(checked) => handleThemeChange(checked ? 'dark' : 'light')}
        className="mr-2"
      />
      <SunIcon
        className={`h-6 w-6 dark:text-yellow-400 ${
          theme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
        } transition-transform`}
      />
      <MoonIcon
        className={`absolute h-6 w-6 dark:text-gray-400 ${
          theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
        } transition-transform`}
      />
      <span className="sr-only">Mudar tema</span>
    </div>
  )
}
