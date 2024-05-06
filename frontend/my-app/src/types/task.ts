import { Subtasks } from "./subtasks";

export interface Task {
    ID: number,
    CreatedAt: string,
    title: string;
    UpdatedAt: string,
    DeletedAt: string | null,
    description: string,
    status: string
    subtasks: Subtasks
}
