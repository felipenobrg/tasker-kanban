package models

import "errors"

type SubTask struct {
	Model
	TaskID uint   `json:"task_id" gorm:"foreignKey:task_id;not null"`
	Name   string `json:"name" gorm:"not null"`
	Status string `json:"status" gorm:"default:'Disabled'"`
}

func (s *SubTask) Validate() error {
	statusAccepted := []string{"Disabled", "Enabled", ""}

	for _, status := range statusAccepted {
		if status == s.Status {
			return nil
		}
	}

	errormsg := "invalid status. Accepted values are: Disabled or Enabled"
	err := errors.New(errormsg)

	return err
}
