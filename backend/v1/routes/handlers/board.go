package handlers

import (
	"errors"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"

	"tasker/models"
	"tasker/util"

)

type data struct {
	User   UserPayload    `json:"user"`
	Boards []models.Board `json:"boards"`
}

type UserPayload struct {
	CreateAt time.Time `json:"createAt"`
	Name     string    `json:"name"`
	Email    string    `json:"email"`
}

type BoardPayload struct {
	Name  string        `json:"name"`
	Tasks []TaskPayload `json:"tasks"`
}

func (app *Handlers) GetBoards(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value("user").(models.User)
	userID := user.ID

	var boards []models.Board
	app.DB.Where("user_id = ?", userID).Find(&boards)

	var tasks []models.Task
	app.DB.Find(&tasks)

	for i := range boards {
		for j := range tasks {
			if tasks[j].BoardID == boards[i].ID {
				boards[i].Tasks = append(boards[i].Tasks, tasks[j])
			}
		}
	}

	userPayload := UserPayload{
		CreateAt: user.CreatedAt,
		Name:     user.Name,
		Email:    user.Email,
	}

	responsePayload := jsonResponse{
		Error:   false,
		Message: "boards fetched successfully",
		Data:    data{User: userPayload, Boards: boards},
	}

	util.WriteJSON(w, http.StatusOK, responsePayload)
}

func (app *Handlers) CreateBoard(w http.ResponseWriter, r *http.Request) {
	payload := BoardPayload{}
	userID := r.Context().Value("user").(models.User).ID
	userEmail := r.Context().Value("user").(models.User).Email

	err := util.ReadJson(w, r, &payload)
	if err != nil {
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	newBoard := models.Board{
		UserID: userID,
		User:   userEmail,
		Name:   payload.Name,
		Tasks:  []models.Task{},
	}

	app.DB.Create(&newBoard)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "board created successfully",
		Data:    newBoard,
	}

	util.WriteJSON(w, http.StatusCreated, responsePayload)
}

func (app *Handlers) DeleteBoard(w http.ResponseWriter, r *http.Request) {
	var board models.Board
	boardID := chi.URLParam(r, "id")

	app.DB.First(&board, boardID)
	if board.ID == 0 {
		err := errors.New("board not found")
		util.ErrorJSON(w, err, http.StatusNotFound)
		return
	}

	userID := r.Context().Value("user").(models.User).ID
	if board.UserID != userID {
		err := errors.New("board not found")
		util.ErrorJSON(w, err, http.StatusNotFound)
		return
	}

	app.DB.Delete(&board)
	app.DB.Where("board_id = ?", boardID).Delete(&models.Task{})

	responsePayload := jsonResponse{
		Error:   false,
		Message: "board deleted successfully",
	}
	util.WriteJSON(w, http.StatusOK, responsePayload)
}

func (app *Handlers) UpdateBoard(w http.ResponseWriter, r *http.Request) {
	var board models.Board
	boardID := chi.URLParam(r, "id")

	app.DB.First(&board, boardID)
	if board.ID == 0 {
		err := errors.New("board not found")
		util.ErrorJSON(w, err, http.StatusNotFound)
		return
	}

	userID := r.Context().Value("user").(models.User).ID
	if board.UserID != userID {
		err := errors.New("board not found")
		util.ErrorJSON(w, err, http.StatusNotFound)
		return
	}

	var boardPayload BoardPayload
	err := util.ReadJson(w, r, &boardPayload)
	if err != nil {
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	board.Name = boardPayload.Name
	app.DB.Save(&board)

	responsePayload := jsonResponse{
		Error:   false,
		Message: "board updated successfully",
		Data:    board,
	}
	util.WriteJSON(w, http.StatusOK, responsePayload)
}
