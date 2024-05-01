package handlers

import (
	"gorm.io/gorm"
)

type jsonResponse struct {
	Error   bool   `json:"error"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

type Handlers struct {
	DB *gorm.DB
}

func NewHandlers(db *gorm.DB) *Handlers {
	return &Handlers{db}
}
