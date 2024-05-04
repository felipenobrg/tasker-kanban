package models

import (
	"net"
	"strings"

	"github.com/go-playground/validator/v10"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string `json:"name" gorm:"not null" validate:"name"`
	Email    string `json:"email" gorm:"unique;not null" validate:"email"`
	Password string `json:"password" gorm:"not null" validate:"min=6"`
}

var validate = validator.New(validator.WithRequiredStructEnabled())

func (user *User) ValidaUser() error {
	validate.RegisterAlias("name", "required,min=3,max=50,excludesall=!@#?")
	err := validate.Struct(user)
	if err != nil {
		return err
	}

	// Check if the email address exists
	i := strings.Index(user.Email, "@")
	host := user.Email[i+1:]

	_, err = net.LookupMX(host)
	if err != nil {
		return err
	}
	return nil
}

func (user *User) GenerateHash() (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func (user *User) PasswordValidate(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
}
