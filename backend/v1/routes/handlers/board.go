package handlers

import (
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"

	"tasker/models"
)

type BoardPayload struct {
	Name  string        `json:"name"`
	Tasks []TaskPayload `json:"tasks"`
}

func (app *Handlers) GetBoards(w http.ResponseWriter, r *http.Request) {
	var boards []models.Board
	app.DB.Find(&boards)

	for i := range boards {
		var tasks []models.Task
		app.DB.Where("board_id = ?", boards[i].ID).Find(&tasks)
		boards[i].Tasks = tasks
	}

	responsePayload := jsonResponse{
		Error:   false,
		Message: "boards fetched successfully",
		Data:    boards,
	}

	app.writeJSON(w, http.StatusOK, responsePayload)
}

func (app *Handlers) CreateBoard(w http.ResponseWriter, r *http.Request) {
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

	app.DB.Create(&newBoard)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "board created successfully",
		Data:    newBoard,
	}

	app.writeJSON(w, http.StatusCreated, responsePayload)
}

func (app *Handlers) DeleteBoard(w http.ResponseWriter, r *http.Request) {
	var board models.Board
	boardID := chi.URLParam(r, "id")

	app.DB.First(&board, boardID)
	if board.ID == 0 {
		err := errors.New("board not found")
		app.errorJSON(w, err, http.StatusNotFound)
		return
	}

	app.DB.Delete(&board)
	app.DB.Where("board_id = ?", boardID).Delete(&models.Task{})

	responsePayload := jsonResponse{
		Error:   false,
		Message: "board deleted successfully",
	}
	app.writeJSON(w, http.StatusOK, responsePayload)
}

func (app *Handlers) UpdateBoard(w http.ResponseWriter, r *http.Request) {
	var board models.Board
	boardID := chi.URLParam(r, "id")

	app.DB.First(&board, boardID)
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
	app.DB.Save(&board)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "board updated successfully",
		Data:    board,
	}
	app.writeJSON(w, http.StatusOK, responsePayload)
}
