package models

import (
	"errors"

	"gorm.io/gorm"
)

type Board struct {
	gorm.Model
	Description string `json:"description"`
	Status      string `json:"status" gorm:"default:'Backlog'"`
}

func (b *Board) Validate() error {
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
