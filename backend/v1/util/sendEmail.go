package util

import (
	"bytes"
	"fmt"
	"html/template"
	"os"

	"gopkg.in/gomail.v2"

)

type Message struct {
	From        string
	To          string
	Subject     string
	Attachments []string
	Data        any
	DataMap     map[string]any
}

var (
	domain   = os.Getenv("MAIL_DOMAIN")
	user     = os.Getenv("MAIL_USER")
	password = os.Getenv("MAIL_PASSWORD")
)

func (msg *Message) SendGomail() error {
	msg.From = user
	msg.DataMap = map[string]any{
		"message": msg.Data,
	}

	var body bytes.Buffer
	tpl, err := template.New("verification_code").ParseFiles("./templates/mail.html.gohtml")
	if err != nil {
		return err
	}
	tpl.ExecuteTemplate(&body, "body", msg.DataMap)

	m := gomail.NewMessage()
	m.SetHeader("From", msg.From)
	m.SetHeader("To", msg.To)
	m.SetHeader("Subject", msg.Subject)
	m.SetBody("text/html", body.String())

	d := gomail.NewDialer(fmt.Sprintf("smtp.%s", domain), 587, user, password)

	// Send the email to Bob, Cora and Dan.
	if err := d.DialAndSend(m); err != nil {
		return err
	}

	return nil
}
