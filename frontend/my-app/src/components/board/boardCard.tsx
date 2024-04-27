import { Card } from "../ui/card";
import { Reorder } from 'framer-motion';

interface BoardCardProps {
    name: string;
    data: { value: string, id: number }[]; 
    setData: (data: { value: string, id: number }[]) => void; 
}

export default function BoardCard({ name, data, setData }: BoardCardProps) {
    return (
        <div className="flex flex-row">
            <div className="flex flex-col gap-4">
            <h1 className="font-semibold mb-1">{name}</h1>
            <Reorder.Group values={data} onReorder={setData} axis="x">
                {data.map((item) => (
                    <Reorder.Item value={item} key={item.id}>
                            <Card><p className="from-neutral-700 text-sm">{item.value}</p></Card>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </div>
        </div>
    );
}