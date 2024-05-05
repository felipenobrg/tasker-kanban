package routes

import (
	"context"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"tasker/models"
	"tasker/util"
)

const statusUnauthorized = http.StatusUnauthorized

func (app *Config) AuthenticatedOnly(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		cookie, err := r.Cookie("session_token")
		if err != nil {
			http.Error(w, http.StatusText(statusUnauthorized), statusUnauthorized)
			return
		}

		tokenString := cookie.Value
		token, err := util.ParseToken(tokenString)
		if err != nil {
			http.Error(w, http.StatusText(statusUnauthorized), statusUnauthorized)
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			if float64(time.Now().Unix()) > claims["exp"].(float64) {
				http.Error(w, http.StatusText(statusUnauthorized), statusUnauthorized)
				return
			}

			var user models.User
			app.Handlers.DB.First(&user, claims["sub"])
			if user.ID == 0 {
				http.Error(w, http.StatusText(statusUnauthorized), statusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), "user", user)

			next.ServeHTTP(w, r.WithContext(ctx))

		} else {
			http.Error(w, http.StatusText(statusUnauthorized), statusUnauthorized)
		}
	})
}
