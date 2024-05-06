export interface Subtasks {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    task_id: number,
    name: string,
    status: "Enabled" | "Disabled"
}
