package models

import (
	"errors"
	"time"
)

type Model struct {
	ID        uint `gorm:"primarykey"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

type Task struct {
	Model
	BoardID     uint   `json:"board_id" gorm:"foreignKey:board_id"`
	Description string `json:"description"`
	Status      string `json:"status" gorm:"default:'Backlog'"`
}

func (b *Task) Validate() error {
	statusAccepted := []string{"Backlog", "Em andamento", "Feito", ""}

	for _, status := range statusAccepted {
		if status == b.Status {
			return nil
		}
	}

	errormsg := "invalid status. Accepted values are: Backlog, Em andamento or Feito"
	err := errors.New(errormsg)

	return err
}
