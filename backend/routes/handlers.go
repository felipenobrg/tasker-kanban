package routes

import (
	"net/http"

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
