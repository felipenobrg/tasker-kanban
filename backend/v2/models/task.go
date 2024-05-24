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
	BoardID     uint      `json:"board_id" gorm:"foreignKey:board_id;not null"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description" gorm:"not null"`
	Status      string    `json:"status" gorm:"default:'Pendente'"`
	Priority    string    `json:"priority" gorm:"default:'Baixa'"`
	SubTasks    []SubTask `json:"subtasks" gorm:"-"`
}

func (t *Task) BeforeDelete(tx *gorm.DB) error {
	tx.Where("task_id = ?", t.ID).Delete(&SubTask{})
	return nil
}

func (b *Task) Validate() error {
	err := checkStatus(b.Status)
	if err != nil {
		return err
	}

	err = checkPriority(b.Priority)
	if err != nil {
		return err
	}
	return err
}

func checkStatus(taskStatus string) error {
	statusAccepted := []string{"Pendente", "Em andamento", "Feito", ""}

	for _, status := range statusAccepted {
		if status == taskStatus {
			return nil
		}
	}

	errormsg := "invalid status. Accepted values are: Pendente, Em andamento or Feito"
	err := errors.New(errormsg)

	return err
}

func checkPriority(taskPriority string) error {
	priorityAccepted := []string{"Baixa", "Média", "Alta", ""}

	for _, priority := range priorityAccepted {
		if priority == taskPriority {
			return nil
		}
	}

	errormsg := "invalid priority. Accepted values are: Baixa, Média or Alta"
	err := errors.New(errormsg)

	return err
}
