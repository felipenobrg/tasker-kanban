package routes

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"

	"tasker/routes/handlers"
)

type Config struct {
	Handlers *handlers.Handlers
}

func (app *Config) Routes() http.Handler {
	r := chi.NewRouter()
	hand := app.Handlers

	// CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Middlewares
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(2500 * time.Millisecond))
	r.Use(middleware.Heartbeat("/ping"))

	// Routes
	r.Route("/api/v1", func(r chi.Router) {

		r.Post("/signin", hand.Signin)
		r.Post("/login", hand.Login)
		r.Post("/verifycode", hand.VerifyCode)
		r.Post("/resendcode", hand.ResendCode)

		r.Route("/boards", func(r chi.Router) {
			r.Use(app.AuthenticatedOnly)

			r.Get("/", hand.GetBoards)
			r.Post("/", hand.CreateBoard)
			r.Get("/{id}", hand.GetBoardByID)
			r.Delete("/{id}", hand.DeleteBoard)
			r.Put("/{id}", hand.UpdateBoard)
		})

		r.Route("/tasks", func(r chi.Router) {
			r.Use(app.AuthenticatedOnly)

			r.Get("/", hand.GetTasks)
			r.Post("/", hand.CreateTask)
			r.Get("/{id}", hand.GetTasksByID)
			r.Delete("/{id}", hand.DeleteTask)
			r.Put("/{id}", hand.UpdateTask)
		})

		r.Route("/subtasks", func(r chi.Router) {
			r.Use(app.AuthenticatedOnly)

			r.Get("/", hand.GetSubTasks)
			r.Post("/", hand.CreateSubTask)
			r.Get("/{id}", hand.GetSubTasksByID)
			r.Delete("/{id}", hand.DeleteSubTask)
			r.Put("/{id}", hand.UpdateSubTask)
		})
	})

	return r
}
