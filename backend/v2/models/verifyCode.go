package models

type VerifyCode struct {
	Model
	UserID uint `json:"user_id" gorm:"foreignKey:user_id;not null"`
	Code   uint `json:"code"`
}
