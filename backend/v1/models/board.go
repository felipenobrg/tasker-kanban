package models

import "gorm.io/gorm"

type Board struct {
	Model
	UserID uint   `json:"-" gorm:"foreignKey:user_id;not null"`
	User   string `json:"user" gorm:"not null"`
	Name   string `json:"name" gorm:"not null"`
	Tasks  []Task `json:"tasks" gorm:"-"`
}

func (b *Board) BeforeDelete(tx *gorm.DB) error {
	tx.Where("board_id = ?", b.ID).Delete(&Task{})
	return nil
}
