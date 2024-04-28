package routes

import (
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"

	"tasker/models"

)

type BoardPayload struct {
	Description string `json:"description"`
	Status      string `json:"status"`
}

func (app *Config) GetBoards(w http.ResponseWriter, r *http.Request) {
	var boards []models.Board

	app.Postgres.Find(&boards)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "Boards fetched successfully",
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
		Description: payload.Description,
		Status:      payload.Status,
	}

	err = newBoard.Validate()
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	app.Postgres.Create(&newBoard)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "Board created successfully",
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

	responsePayload := jsonResponse{
		Error:   false,
		Message: "Board deleted successfully",
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

	board.Description = boardPayload.Description
	board.Status = boardPayload.Status

	err = board.Validate()
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	app.Postgres.Save(&board)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "Board updated successfully",
		Data:    board,
	}
	app.writeJSON(w, http.StatusOK, responsePayload)
}
