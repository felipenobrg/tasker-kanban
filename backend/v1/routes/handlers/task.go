package handlers

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"

	"tasker/models"
	"tasker/util"

)

type TaskPayload struct {
	BoardID     uint             `json:"board_id"`
	Title       string           `json:"title"`
	Description string           `json:"description"`
	Status      string           `json:"status"`
	SubTasks    []models.SubTask `json:"subtasks"`
}

func getTasksForCurrentUser(r *http.Request, DB *gorm.DB, boardId string) []models.Task {
	var tasks []models.Task
	userID := r.Context().Value("user").(models.User).ID

	if boardId != "" {
		DB.Raw(`
			SELECT tasks.* FROM tasks 
			JOIN boards ON tasks.board_id = boards.id 
			WHERE boards.user_id = ? AND tasks.board_id = ?
		`, userID, boardId).Scan(&tasks)
		return tasks
	}

	DB.Raw(`
		SELECT tasks.* FROM tasks 
		JOIN boards ON tasks.board_id = boards.id 
		WHERE boards.user_id = ?
	`, userID).Scan(&tasks)
	return tasks
}

func (app *Handlers) GetTasks(w http.ResponseWriter, r *http.Request) {
	var tasks []models.Task
	boardID := r.URL.Query().Get("boardId")
	userID := r.Context().Value("user").(models.User).ID

	tasks = getTasksForCurrentUser(r, app.DB, boardID)

	var subtasks []models.SubTask
	app.DB.Raw(`
		SELECT sub_tasks.* FROM sub_tasks 
		JOIN tasks on sub_tasks.task_id = tasks.id
		JOIN boards ON tasks.board_id = boards.id 
		WHERE boards.user_id = ?
	`, userID).Scan(&subtasks)

	for i := range tasks {
		for j := range subtasks {
			if subtasks[j].TaskID == tasks[i].ID {
				tasks[i].SubTasks = append(tasks[i].SubTasks, subtasks[j])
			}
		}
	}

	responsePayload := jsonResponse{
		Error:   false,
		Message: "tasks fetched successfully",
		Data:    tasks,
	}

	util.WriteJSON(w, http.StatusOK, responsePayload)
}

func (app *Handlers) GetTasksByID(w http.ResponseWriter, r *http.Request) {
	var task models.Task
	taskID := chi.URLParam(r, "id")

	app.DB.First(&task, taskID)
	if task.ID == 0 {
		err := errors.New("task not found")
		util.ErrorJSON(w, err, http.StatusNotFound)
		return
	}

	var board models.Board
	app.DB.First(&board, fmt.Sprint(task.BoardID))
	userID := r.Context().Value("user").(models.User).ID
	if board.ID == 0 || board.UserID != userID {
		err := errors.New("task not found")
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	responsePayload := jsonResponse{
		Error:   false,
		Message: "task fetched successfully",
		Data:    task,
	}
	util.WriteJSON(w, http.StatusOK, responsePayload)
}

func (app *Handlers) CreateTask(w http.ResponseWriter, r *http.Request) {
	payload := TaskPayload{}

	err := util.ReadJson(w, r, &payload)
	if err != nil {
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	newTask := models.Task{
		BoardID:     payload.BoardID,
		Title:       payload.Title,
		Description: payload.Description,
		Status:      payload.Status,
	}

	err = newTask.Validate()
	if err != nil {
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	var board models.Board
	app.DB.First(&board, fmt.Sprint(newTask.BoardID))
	userID := r.Context().Value("user").(models.User).ID
	if board.ID == 0 || board.UserID != userID {
		err := errors.New("the given board does not exist")
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	app.DB.Create(&newTask)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "task created successfully",
		Data:    newTask,
	}

	util.WriteJSON(w, http.StatusCreated, responsePayload)
}

func (app *Handlers) DeleteTask(w http.ResponseWriter, r *http.Request) {
	var task models.Task
	taskID := chi.URLParam(r, "id")

	app.DB.First(&task, taskID)
	if task.ID == 0 {
		err := errors.New("task not found")
		util.ErrorJSON(w, err, http.StatusNotFound)
		return
	}

	var board models.Board
	app.DB.First(&board, fmt.Sprint(task.BoardID))
	userID := r.Context().Value("user").(models.User).ID
	if board.ID == 0 || board.UserID != userID {
		err := errors.New("task not found")
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	app.DB.Delete(&task)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "task deleted successfully",
	}
	util.WriteJSON(w, http.StatusOK, responsePayload)
}

func (app *Handlers) UpdateTask(w http.ResponseWriter, r *http.Request) {
	var task models.Task
	taskID := chi.URLParam(r, "id")

	app.DB.First(&task, taskID)
	if task.ID == 0 {
		err := errors.New("task not found")
		util.ErrorJSON(w, err, http.StatusNotFound)
		return
	}

	var board models.Board
	app.DB.First(&board, fmt.Sprint(task.BoardID))
	userID := r.Context().Value("user").(models.User).ID
	if board.ID == 0 || board.UserID != userID {
		err := errors.New("task not found")
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	var taskPayload TaskPayload
	err := util.ReadJson(w, r, &taskPayload)
	if err != nil {
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	task.Title = taskPayload.Title
	task.Description = taskPayload.Description
	task.Status = taskPayload.Status

	err = task.Validate()
	if err != nil {
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	app.DB.Save(&task)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "task updated successfully",
		Data:    task,
	}
	util.WriteJSON(w, http.StatusOK, responsePayload)
}
