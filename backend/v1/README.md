# Tasker api

## Introdução

API criada para o projeto integrador **"Tasker"**, desenvolvido pelo grupo 2 da sala P2 Noite. A api consiste em um CRUD para gerenciar tarefas criadas pelo usuário, afim de criar, editar, excluir e mostrar tarefas com descrição e status pré defenidos.

## Endpoints

### GET /api/v1/boards

Retorna uma lista de todas os quadros criados, bem como suas respectivas tarefas.

**Parâmetros:**

Nenhum.

**Resposta:**

```json
{
 "error": false,
 "message": "boards fetched successfully",
 "data": [
  {
   "ID": 2,
   "CreatedAt": "2024-04-30T23:17:17.842608Z",
   "UpdatedAt": "2024-04-30T23:17:17.842608Z",
   "DeletedAt": null,
   "name": "Board Exemplo",
   "tasks": [
    {
     "ID": 3,
     "CreatedAt": "2024-04-30T23:18:19.957549Z",
     "UpdatedAt": "2024-04-30T23:54:46.529809Z",
     "board_id": 2,
     "description": "Update test",
     "status": "Feito"
    }
   ]
  }
 ]
}
```

### POST /api/v1/boards/add

Cria um quadro novo.

**Parâmetros:**

- `name`: O nome do quadro.

**Resposta:**

```json
{
 "error": false,
 "message": "board created successfully",
 "data": {
  "ID": 3,
  "CreatedAt": "2024-04-30T23:55:09.684258081Z",
  "UpdatedAt": "2024-04-30T23:55:09.684258081Z",
  "DeletedAt": null,
  "name": "Board Exemplo",
  "tasks": []
 }
}
```

### PUT /api/v1/boards/update/id

Atualza um quadro já existente.

**Parâmetros:**

- `name`: O novo nome do quadro.

**Resposta:**

```json
{
 "error": false,
 "message": "board created successfully",
 "data": {
  "ID": 3,
  "CreatedAt": "2024-04-30T23:55:09.684258081Z",
  "UpdatedAt": "2024-04-30T23:55:09.684258081Z",
  "DeletedAt": null,
  "name": "Board Exemplo alterado",
  "tasks": []
 }
}
```

### DELETE /api/v1/boards/delete/id

Deleta um quadro e todas suas respectivas tarefas.

**Parâmetros:**

Nenhum.

**Resposta:**

```json
{
 "error": false,
 "message": "board deleted successfully"
}
```

### GET /api/v1/tasks

Retorna uma lista de todas as tarefas.

**Parâmetros:**

Nenhum.

**Resposta:**

```json
{
 "error": false,
 "message": "tasks fetched successfully",
 "data": [
  {
   "ID": 1,
   "CreatedAt": "2024-04-30T23:18:19.957549Z",
   "UpdatedAt": "2024-04-30T23:54:46.529809Z",
   "board_id": 2,
   "description": "Estudar",
   "status": "Feito"
  },
  {
   "ID": 2,
   "CreatedAt": "2024-05-01T00:32:04.044972Z",
   "UpdatedAt": "2024-05-01T00:32:04.044972Z",
   "board_id": 2,
   "description": "Correr",
   "status": "Backlog"
  }
 ]
}
```

### POST /api/v1/tasks/add

Cria uma nova tarefa em um quadro já existente.

**Parâmetros:**

- `board_id`: O id do board a quem pertence (obrigatório).
- `description`: A descrição da tarefa (opcional).
- `status`: O status da tarefa (`Backlog`, `Em andamento` ou `Feito`).

**Resposta:**

```json
{
 "error": false,
 "message": "task created successfully",
 "data": {
  "ID": 3,
  "CreatedAt": "2024-05-01T00:32:42.000139071Z",
  "UpdatedAt": "2024-05-01T00:32:42.000139071Z",
  "board_id": 1,
  "description": "Treinar",
  "status": "Em andamento"
 }
}
```

### PUT /api/v1/tasks/update/id

Atualiza uma tarefa existente.

**Parâmetros:**

- `description`: A descrição da tarefa (opcional).
- `status`: O status da tarefa (`Backlog`, `Em andamento` ou `Feito`).

**Resposta:**

```json
{
 "error": false,
 "message": "task created successfully",
 "data": {
  "ID": 3,
  "CreatedAt": "2024-05-01T00:32:42.000139071Z",
  "UpdatedAt": "2024-05-01T00:32:42.000139071Z",
  "board_id": 1,
  "description": "Treinar Atualizado",
  "status": "Feito"
 }
}
```

### DELETE /api/v1/tasks/delete/id

Atualiza uma tarefa existente.

**Parâmetros:**

Nenhum.

**Resposta:**

```json
{
 "error": false,
 "message": "board deleted successfully"
}
```
