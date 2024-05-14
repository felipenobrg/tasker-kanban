package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"tasker/models"
	"tasker/util"

)

type verifyCodePayload struct {
	Email string `json:"email"`
	Code  string `json:"code"`
}

type queryResult struct {
	models.VerifyCode
	models.User
}

func (app *Handlers) VerifyCode(w http.ResponseWriter, r *http.Request) {
	var payload verifyCodePayload
	err := util.ReadJson(w, r, &payload)
	if err != nil {
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	var query queryResult
	app.DB.Raw(`
		SELECT * FROM verify_codes
		JOIN users ON users.id = verify_codes.user_id
		WHERE users.email = ?
	`, payload.Email).Scan(&query)

	if fmt.Sprint(query.Code) != payload.Code {
		err := errors.New("invalid code")
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	query.User.Active = true
	app.DB.Save(&query.User)

	token, err := util.GenerateToken(&query.User)
	if err != nil {
		err = errors.New("error generating jwt token")
		util.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	responsePayload := jsonResponse{
		Error:   false,
		Message: "user verified successfully",
		Data:    map[string]any{"session_token": token},
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

func (app *Handlers) ResendCode(w http.ResponseWriter, r *http.Request) {
	type emailPayload struct {
		Email string `json:"email"`
	}

	var payload emailPayload
	err := util.ReadJson(w, r, &payload)
	if err != nil {
		util.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	var user models.User
	app.DB.Where("email = ?", payload.Email).First(&user)
	if user.ID == 0 {
		err := errors.New("user not found")
		util.ErrorJSON(w, err, http.StatusNotFound)
		return
	}

	var verifyCode models.VerifyCode
	app.DB.Where("user_id = ?", user.ID).First(&verifyCode)
	if verifyCode.ID == 0 {
		err := errors.New("code not found")
		util.ErrorJSON(w, err, http.StatusNotFound)
		return
	}

	verifyCode.Code = util.GenerateVerifyCode()
	app.DB.Save(&verifyCode)

	msg := util.Message{
		To:      user.Email,
		Subject: "Tasker - Verify your email",
		Data:    verifyCode.Code,
	}
	go msg.SendGomail()

	responsePayload := jsonResponse{
		Error:   false,
		Message: "verification code sent to email",
	}
	util.WriteJSON(w, http.StatusOK, responsePayload)
}
