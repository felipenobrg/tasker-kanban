package handlers

import (
	"errors"
	"net/http"
	"time"

	"tasker/models"
	"tasker/util"
)

type UserPayload struct {
	CreateAt time.Time `json:"createAt"`
	Name     string    `json:"name"`
	Email    string    `json:"email"`
}

type signinPayload struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (app *Handlers) Signin(w http.ResponseWriter, r *http.Request) {
	var payload signinPayload
	err := util.ReadJson(w, r, &payload)
	if err != nil {
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	newUser := models.User{
		Name:     payload.Name,
		Email:    payload.Email,
		Password: payload.Password,
	}

	err = newUser.ValidaUser()
	if err != nil {
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	hash, err := newUser.GenerateHash()
	if err != nil {
		util.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}
	newUser.Password = hash

	app.DB.Create(&newUser)
	if newUser.ID == 0 {
		err := errors.New("user already exists")
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	verifyCode := models.VerifyCode{
		UserID: newUser.ID,
		Code:   util.GenerateVerifyCode(),
	}
	app.DB.Create(&verifyCode)
	if verifyCode.ID == 0 {
		err := errors.New("error creating verification code")
		util.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	msg := util.Message{
		To:      newUser.Email,
		Subject: "Tasker - Verify your email",
		Data:    verifyCode.Code,
	}
	verifyMsg := "verification code sent to email"
	go msg.SendGomail()

	userPayload := UserPayload{
		CreateAt: newUser.CreatedAt,
		Name:     newUser.Name,
		Email:    newUser.Email,
	}

	responsePayload := jsonResponse{
		Error:   false,
		Message: "user created successfully",
		Data:    map[string]any{"user": userPayload, "verify_code": verifyMsg},
	}

	util.WriteJSON(w, http.StatusCreated, responsePayload)
}

func (app *Handlers) Login(w http.ResponseWriter, r *http.Request) {
	var payload loginPayload
	err := util.ReadJson(w, r, &payload)
	if err != nil {
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	user := models.User{}
	app.DB.Where("email = ?", payload.Email).First(&user)
	if user.ID == 0 {
		err := errors.New("invalid credentials")
		util.ErrorJSON(w, err, http.StatusNotFound)
		return
	}

	err = user.PasswordValidate(payload.Password)
	if err != nil {
		err := errors.New("invalid credentials")
		util.ErrorJSON(w, err, http.StatusUnauthorized)
		return
	}

	if !user.Active {
		err := errors.New("user not verified")
		util.ErrorJSON(w, err, http.StatusUnauthorized)
		return
	}

	token, err := util.GenerateToken(&user)
	if err != nil {
		err = errors.New("error generating jwt token")
		util.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	userPayload := UserPayload{
		CreateAt: user.CreatedAt,
		Name:     user.Name,
		Email:    user.Email,
	}

	responsePayload := jsonResponse{
		Error:   false,
		Message: "login successful",
		Data:    map[string]any{"session_token": token, "user": userPayload},
	}

	cookie := http.Cookie{
		Name:     "session_token",
		Value:    token,
		Path:     "/",
		Domain:   "",
		Expires:  time.Now().Add(60 * time.Minute),
		HttpOnly: true,
		Secure:   false,
	}

	http.SetCookie(w, &cookie)
	util.WriteJSON(w, http.StatusOK, responsePayload)
}
