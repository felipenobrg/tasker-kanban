package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"itinerario/database"
	"itinerario/routes"
)

const webPort = "8080"

func main() {
	// Connect to database
	postgresConn, err := database.Connect()
	if err != nil {
		log.Println(err)
		os.Exit(1)
	}

	app := routes.Config{
		Postgres: postgresConn,
	}
	log.Printf("Server is running on port:%s\n\n", webPort)

	// Define http server
	srv := &http.Server{
		Addr:    fmt.Sprintf(":%s", webPort),
		Handler: app.Routes(),
	}

	// Start server
	if err := srv.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
