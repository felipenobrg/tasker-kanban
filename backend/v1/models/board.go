package models

type Board struct {
	Model
	UserID uint   `json:"-" gorm:"foreignKey:user_id;not null"`
	User   string `json:"user" gorm:"not null"`
	Name   string `json:"name" gorm:"not null"`
	Tasks  []Task `json:"tasks" gorm:"-"`
}
