package database

import (
	"fmt"
	"log"
	"math"
	"os"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"tasker/models"

)

var (
	DB  *gorm.DB
	err error
)

func Connect() (*gorm.DB, error) {
	var counts int64
	var backOff = 1 * time.Second
	var connection *gorm.DB

	if _, err := os.Stat(".env"); err == nil {
		err = godotenv.Load()
		if err != nil {
			log.Panic(err.Error())
		}
	}

	dns := os.Getenv("DB_DNS")

	for {
		DB, err = gorm.Open(postgres.Open(dns))
		if err != nil {
			counts++
		} else {
			log.Println("Conectado com postgres")
			DB.AutoMigrate(&models.User{}, &models.VerifyCode{}, &models.Board{}, &models.Task{}, &models.SubTask{})
			connection = DB
			break
		}

		if counts > 5 {
			fmt.Println("Erro ao conectar com database")
			return nil, err
		}

		backOff = time.Duration(math.Pow(float64(counts), 2)) * time.Second
		log.Println("Erro ao conectar com database postgres. Tentando novamente em ", backOff, "segundos.")
		time.Sleep(backOff)
		continue

	}

	return connection, nil
}
