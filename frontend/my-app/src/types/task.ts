export interface Task {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    DeletedAt: string | null,
    description: string,
    status: "Backlog" | "Em andamento" | "Feito"
}
