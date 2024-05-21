package util

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"tasker/models"

)

func GenerateToken(user *models.User, tokenType ...string) (string, error) {
	key, duration, err := selectClaims(tokenType...)
	if err != nil {
		return "", err
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Minute * duration).Unix(),
	})
	return token.SignedString([]byte(os.Getenv(key)))
}

func ParseToken(tokenString string, tokenType ...string) (*jwt.Token, error) {
	key, _, err := selectClaims(tokenType...)
	if err != nil {
		return nil, err
	}

	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(os.Getenv(key)), nil
	})
}

func selectClaims(tokenType ...string) (string, time.Duration, error) {
	var key string
	var duration time.Duration

	if len(tokenType) == 0 {
		key = "SECRET_KEY"
		duration = 60
		return key, duration, nil
	}

	if tokenType[0] == "reset_password" {
		key = "RESET_PASSWORD_KEY"
		duration = 5
		return key, duration, nil
	}

	err := errors.New("invalid token type")
	return "", 0, err
}
