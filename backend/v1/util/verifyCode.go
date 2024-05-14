package util

import (
	"math/rand"
	"time"
)

func GenerateVerifyCode() uint {
	rand.Seed(time.Now().UnixNano())
	return uint(rand.Intn(9000) + 1000)
}
