package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type Model struct {
	ID        uint `gorm:"primarykey"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

type Task struct {
	Model
	BoardID     uint   `json:"board_id" gorm:"foreignKey:board_id;not null"`
	Title       string `json:"title" gorm:"not null"`
	Description string `json:"description" gorm:"not null"`
	Status      string `json:"status" gorm:"default:'Pendente'"`
}

func (t *Task) BeforeDelete(tx *gorm.DB) error {
	tx.Where("task_id = ?", t.ID).Delete(&SubTask{})
	return nil
}

func (b *Task) Validate() error {
	statusAccepted := []string{"Pendente", "Em andamento", "Feito", ""}

	for _, status := range statusAccepted {
		if status == b.Status {
			return nil
		}
	}

	errormsg := "invalid status. Accepted values are: Backlog, Em andamento or Feito"
	err := errors.New(errormsg)

	return err
}
