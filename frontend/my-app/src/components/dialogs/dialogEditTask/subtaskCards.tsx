import { Checkbox } from '@/components/ui/checkbox'

export default function SubtaskCard() {
  return (
    <div className="bg-gray-800 w-[20rem] p-2 rounded-lg">
      <div className="flex items-center">
        <Checkbox id="terms" />
        <label htmlFor="terms" className="ml-2">
          Subtarefa
        </label>
      </div>
    </div>
  )
}
