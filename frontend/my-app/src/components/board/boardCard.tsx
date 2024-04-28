import { Card } from '../ui/card'
import { Reorder } from 'framer-motion'

interface BoardCardProps {
  name: string
  data: { value: string; status: string; id: number }[]
  setData: (data: { value: string; status: string; id: number }[]) => void
}

export default function BoardCard(props: BoardCardProps) {
  const { name, data, setData } = props
  console.log(data.map((item) => item))
  return (
    <div className="flex flex-row ml-5">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold mb-1">{name}</h1>
        <Reorder.Group
          className="flex flex-col gap-5"
          values={data}
          onReorder={setData}
          axis="x"
        >
          {data.map((item, index) => (
            <Reorder.Item value={item} key={index}>
              <Card>
                <p className="text-gray-200 text-sm">{item.value}</p>
              </Card>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  )
}
