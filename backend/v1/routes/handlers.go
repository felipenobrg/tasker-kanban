package routes

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"

	"tasker/models"
)

type BoardPayload struct {
	Name  string        `json:"name"`
	Tasks []TaskPayload `json:"tasks"`
}

type TaskPayload struct {
	BoardID     int    `json:"board_id"`
	Description string `json:"description"`
	Status      string `json:"status"`
}

func (app *Config) GetTasks(w http.ResponseWriter, r *http.Request) {
	var tasks []models.Task

	app.Postgres.Find(&tasks)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "tasks fetched successfully",
		Data:    tasks,
	}

	app.writeJSON(w, http.StatusOK, responsePayload)
}

func (app *Config) CreateTask(w http.ResponseWriter, r *http.Request) {
	payload := TaskPayload{}

	err := app.readJson(w, r, &payload)
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	newTask := models.Task{
		BoardID:     payload.BoardID,
		Description: payload.Description,
		Status:      payload.Status,
	}

	err = newTask.Validate()
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	var board models.Board
	app.Postgres.First(&board, fmt.Sprint(newTask.BoardID))
	if board.ID == 0 {
		err := errors.New("the given board does not exist")
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	app.Postgres.Create(&newTask)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "task created successfully",
		Data:    newTask,
	}

	app.writeJSON(w, http.StatusCreated, responsePayload)
}

func (app *Config) DeleteTask(w http.ResponseWriter, r *http.Request) {
	var task models.Task
	taskID := chi.URLParam(r, "id")

	app.Postgres.First(&task, taskID)
	if task.ID == 0 {
		err := errors.New("task not found")
		app.errorJSON(w, err, http.StatusNotFound)
		return
	}

	app.Postgres.Delete(&task)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "task deleted successfully",
	}
	app.writeJSON(w, http.StatusOK, responsePayload)
}

func (app *Config) UpdateTask(w http.ResponseWriter, r *http.Request) {
	var task models.Task
	taskID := chi.URLParam(r, "id")

	app.Postgres.First(&task, taskID)
	if task.ID == 0 {
		err := errors.New("task not found")
		app.errorJSON(w, err, http.StatusNotFound)
		return
	}

	var taskPayload TaskPayload
	err := app.readJson(w, r, &taskPayload)
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	task.Description = taskPayload.Description
	task.Status = taskPayload.Status

	err = task.Validate()
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	app.Postgres.Save(&task)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "task updated successfully",
		Data:    task,
	}
	app.writeJSON(w, http.StatusOK, responsePayload)
}

func (app *Config) GetBoards(w http.ResponseWriter, r *http.Request) {
	var boards []models.Board
	app.Postgres.Find(&boards)

	for i := range boards {
		var tasks []models.Task
		app.Postgres.Where("board_id = ?", boards[i].ID).Find(&tasks)
		boards[i].Tasks = tasks
	}

	responsePayload := jsonResponse{
		Error:   false,
		Message: "boards fetched successfully",
		Data:    boards,
	}

	app.writeJSON(w, http.StatusOK, responsePayload)
}

func (app *Config) CreateBoard(w http.ResponseWriter, r *http.Request) {
	payload := BoardPayload{}

	err := app.readJson(w, r, &payload)
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	newBoard := models.Board{
		Name:  payload.Name,
		Tasks: []models.Task{},
	}

	app.Postgres.Create(&newBoard)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "board created successfully",
		Data:    newBoard,
	}

	app.writeJSON(w, http.StatusCreated, responsePayload)
}

func (app *Config) DeleteBoard(w http.ResponseWriter, r *http.Request) {
	var board models.Board
	boardID := chi.URLParam(r, "id")

	app.Postgres.First(&board, boardID)
	if board.ID == 0 {
		err := errors.New("board not found")
		app.errorJSON(w, err, http.StatusNotFound)
		return
	}

	app.Postgres.Delete(&board)
	app.Postgres.Where("board_id = ?", boardID).Delete(&models.Task{})

	responsePayload := jsonResponse{
		Error:   false,
		Message: "board deleted successfully",
	}
	app.writeJSON(w, http.StatusOK, responsePayload)
}

func (app *Config) UpdateBoard(w http.ResponseWriter, r *http.Request) {
	var board models.Board
	boardID := chi.URLParam(r, "id")

	app.Postgres.First(&board, boardID)
	if board.ID == 0 {
		err := errors.New("board not found")
		app.errorJSON(w, err, http.StatusNotFound)
		return
	}

	var boardPayload BoardPayload
	err := app.readJson(w, r, &boardPayload)
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	board.Name = boardPayload.Name
	app.Postgres.Save(&board)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "board updated successfully",
		Data:    board,
	}
	app.writeJSON(w, http.StatusOK, responsePayload)
}
