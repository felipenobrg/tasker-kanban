package handlers

import (
	"gorm.io/gorm"
)

type Handlers struct {
	DB *gorm.DB
}

func NewHandlers(db *gorm.DB) *Handlers {
	return &Handlers{db}
}
