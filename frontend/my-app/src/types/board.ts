import { Task } from "./task";

export interface BoardData {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    DeletedAt: string | null,
    name: string,
    tasks: Task[]
}

export interface Board {
    error: boolean,
    message: string,
    data: BoardData[]
}
