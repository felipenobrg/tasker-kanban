package handlers

import (
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"

	"tasker/models"
	"tasker/util"
)

type SubTaskPayload struct {
	TaskID uint   `json:"task_id"`
	Name   string `json:"name"`
	Status string `json:"status"`
}

func getSubTasksForCurrentUser(r *http.Request, DB *gorm.DB, taskId string) []models.SubTask {
	var subTasks []models.SubTask
	userID := r.Context().Value("user").(models.User).ID

	if taskId != "" {
		DB.Raw(`
			SELECT sub_tasks.* FROM sub_tasks
			JOIN tasks ON sub_tasks.task_id = tasks.id
			JOIN boards ON tasks.board_id = boards.id
			WHERE boards.user_id = ? AND sub_tasks.task_id = ?
		`, userID, taskId).Scan(&subTasks)
		return subTasks
	}

	DB.Raw(`
		SELECT sub_tasks.* FROM sub_tasks
		JOIN tasks ON sub_tasks.task_id = tasks.id
		JOIN boards ON tasks.board_id = boards.id 
		WHERE boards.user_id = ?
	`, userID).Scan(&subTasks)
	return subTasks
}

func (app *Handlers) GetSubTasks(w http.ResponseWriter, r *http.Request) {
	var subTasks []models.SubTask
	taskID := r.URL.Query().Get("taskId")

	subTasks = getSubTasksForCurrentUser(r, app.DB, taskID)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "subtasks fetched successfully",
		Data:    subTasks,
	}

	util.WriteJSON(w, http.StatusOK, responsePayload)
}

func (app *Handlers) GetSubTasksByID(w http.ResponseWriter, r *http.Request) {
	var subTask models.SubTask
	subTaskID := chi.URLParam(r, "id")

	app.DB.First(&subTask, subTaskID)
	if subTask.ID == 0 {
		err := errors.New("subtask not found")
		util.ErrorJSON(w, err, http.StatusNotFound)
		return
	}

	var task models.Task
	userID := r.Context().Value("user").(models.User).ID
	app.DB.Raw(`
		SELECT tasks.* FROM tasks 
		JOIN boards ON tasks.board_id = boards.id 
		WHERE boards.user_id = ? AND tasks.id = ?
	`, userID, subTask.TaskID).Scan(&task)

	if task.ID == 0 {
		err := errors.New("subtask not found")
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	responsePayload := jsonResponse{
		Error:   false,
		Message: "subtask fetched successfully",
		Data:    subTask,
	}
	util.WriteJSON(w, http.StatusOK, responsePayload)
}

func (app *Handlers) CreateSubTask(w http.ResponseWriter, r *http.Request) {
	var payload SubTaskPayload

	err := util.ReadJson(w, r, &payload)
	if err != nil {
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	newSubTask := models.SubTask{
		TaskID: payload.TaskID,
		Name:   payload.Name,
		Status: payload.Status,
	}

	err = newSubTask.Validate()
	if err != nil {
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	var task models.Task
	userID := r.Context().Value("user").(models.User).ID
	app.DB.Raw(`
		SELECT tasks.* FROM tasks 
		JOIN boards ON tasks.board_id = boards.id 
		WHERE boards.user_id = ? AND tasks.id = ?
	`, userID, newSubTask.TaskID).Scan(&task)

	if task.ID == 0 {
		err := errors.New("task not found")
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	app.DB.Create(&newSubTask)
	responsePayload := jsonResponse{
		Error:   false,
		Message: "subtask created successfully",
		Data:    newSubTask,
	}
	util.WriteJSON(w, http.StatusCreated, responsePayload)
}

func (app *Handlers) DeleteSubTask(w http.ResponseWriter, r *http.Request) {
	var subTask models.SubTask
	subTaskID := chi.URLParam(r, "id")
	userID := r.Context().Value("user").(models.User).ID

	app.DB.First(&subTask, subTaskID)
	if subTask.ID == 0 {
		err := errors.New("subtask not found")
		util.ErrorJSON(w, err, http.StatusNotFound)
		return
	}

	var task models.Task
	app.DB.Raw(`
		SELECT tasks.* FROM tasks 
		JOIN boards ON tasks.board_id = boards.id 
		WHERE boards.user_id = ? AND tasks.id = ?
	`, userID, subTask.TaskID).Scan(&task)

	if task.ID == 0 {
		err := errors.New("subtask not found")
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	app.DB.Delete(&subTask)
	responsePayload := jsonResponse{
		Error:   false,
		Message: "subtask deleted successfully",
		Data:    subTask,
	}
	util.WriteJSON(w, http.StatusOK, responsePayload)
}

func (app *Handlers) UpdateSubTask(w http.ResponseWriter, r *http.Request) {
	var subTask models.SubTask
	subTaskID := chi.URLParam(r, "id")
	userID := r.Context().Value("user").(models.User).ID

	app.DB.First(&subTask, subTaskID)
	if subTask.ID == 0 {
		err := errors.New("subtask not found")
		util.ErrorJSON(w, err, http.StatusNotFound)
		return
	}

	var task models.Task
	app.DB.Raw(`
		SELECT tasks.* FROM tasks 
		JOIN boards ON tasks.board_id = boards.id 
		WHERE boards.user_id = ? AND tasks.id = ?
	`, userID, subTask.TaskID).Scan(&task)

	if task.ID == 0 {
		err := errors.New("subtask not found")
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	var payload SubTaskPayload
	err := util.ReadJson(w, r, &payload)
	if err != nil {
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	subTask.Name = payload.Name
	subTask.Status = payload.Status

	err = subTask.Validate()
	if err != nil {
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	app.DB.Save(&subTask)
	responsePayload := jsonResponse{
		Error:   false,
		Message: "subtask updated successfully",
		Data:    subTask,
	}
	util.WriteJSON(w, http.StatusOK, responsePayload)
}
