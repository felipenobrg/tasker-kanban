package handlers

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"

	"tasker/models"

)

type TaskPayload struct {
	BoardID     int    `json:"board_id"`
	Description string `json:"description"`
	Status      string `json:"status"`
}

func (app *Handlers) GetTasks(w http.ResponseWriter, r *http.Request) {
	var tasks []models.Task

	app.DB.Find(&tasks)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "tasks fetched successfully",
		Data:    tasks,
	}

	app.writeJSON(w, http.StatusOK, responsePayload)
}

func (app *Handlers) CreateTask(w http.ResponseWriter, r *http.Request) {
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
	app.DB.First(&board, fmt.Sprint(newTask.BoardID))
	if board.ID == 0 {
		err := errors.New("the given board does not exist")
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	app.DB.Create(&newTask)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "task created successfully",
		Data:    newTask,
	}

	app.writeJSON(w, http.StatusCreated, responsePayload)
}

func (app *Handlers) DeleteTask(w http.ResponseWriter, r *http.Request) {
	var task models.Task
	taskID := chi.URLParam(r, "id")

	app.DB.First(&task, taskID)
	if task.ID == 0 {
		err := errors.New("task not found")
		app.errorJSON(w, err, http.StatusNotFound)
		return
	}

	app.DB.Delete(&task)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "task deleted successfully",
	}
	app.writeJSON(w, http.StatusOK, responsePayload)
}

func (app *Handlers) UpdateTask(w http.ResponseWriter, r *http.Request) {
	var task models.Task
	taskID := chi.URLParam(r, "id")

	app.DB.First(&task, taskID)
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

	app.DB.Save(&task)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "task updated successfully",
		Data:    task,
	}
	app.writeJSON(w, http.StatusOK, responsePayload)
}
