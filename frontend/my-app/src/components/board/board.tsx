"use client"

import { Button } from "../ui/button";
import BoardCard from "./boardCard";
import { useState } from "react";

export default function Board() {
    const [dataArray, setDataArray] = useState([
        { value: "Teste129", id: 1 },
        { value: "Comer", id: 2 },
        { value: "Estudar", id: 3 },
        { value: "Correr", id: 4 },
        { value: "Correr", id: 5 },
    ]);

    const [namesArray] = useState([
        "Backlog",
        "Em andamento",
        "Em andamento 2",
        "Feito",
        "Feito 2",
    ]);

    const generateUniqueId = () => {
        const maxId = Math.max(...dataArray.map(item => item.id), 0);
        return maxId + 1;
    };

    const addItem = () => {
        const newItem = { value: "New Value", id: generateUniqueId() };
        setDataArray([...dataArray, newItem]);
    };

    return (
        <main className="flex flex-1 gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex flex-col items-center gap-4">
            <Button onClick={addItem} className=" w-2/4 p-3 mb-5">Adicionar novo item</Button>
            <div className="flex flex-row gap-3">
            {dataArray.map((item, index) => (
                <BoardCard key={item.id} name={namesArray[index]} data={dataArray} setData={setDataArray} />
            ))}
            </div>
            </div>
        </main>
    );
}
