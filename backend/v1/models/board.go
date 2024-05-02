package models

import (
	"gorm.io/gorm"
)

type Board struct {
	gorm.Model
	UserID uint   `json:"-" gorm:"foreignKey:user_id"`
	User   string `json:"user"`
	Name   string `json:"name"`
	Tasks  []Task `json:"tasks" gorm:"-"`
}
