package handlers

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"

)

type jsonResponse struct {
	Error   bool   `json:"error"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

// Ler o corpo da requisição e decodificar o JSON, enviando o resultado para o objeto "data"
func (app *Handlers) readJson(w http.ResponseWriter, r *http.Request, data any) error {

	// Limitar o tamanho do corpo da requisição para 1MB
	maxBytes := 1048576 // 1MB
	r.Body = http.MaxBytesReader(w, r.Body, int64(maxBytes))

	// Decodifica o corpo da requisição e atribui seu valor para o objeto "data"
	dec := json.NewDecoder(r.Body)
	err := dec.Decode(data)
	if err != nil {
		return err
	}

	// Verificar se o corpo da requisição contém apenas um objeto JSON
	err = dec.Decode(&struct{}{})
	if err != io.EOF {
		return errors.New("request body must only have a single JSON object")
	}
	return nil
}

// Escreve a resposta da requisição em formato JSON e define o status da resposta
func (app *Handlers) writeJSON(w http.ResponseWriter, status int, data any, headers ...http.Header) error {
	out, err := json.MarshalIndent(data, "", "\t")
	if err != nil {
		return err
	}

	// Checa se o valor de "headers" foi passado como parâmetro
	if len(headers) > 0 {
		// "range headers[0]" itera apenas sobre a primeira posição do slice
		for key, value := range headers[0] { // É uma forma de setar um parâmetro como opcional
			w.Header()[key] = value
		}
	}

	// Escreve a resposta da requisição no formato JSON e define o status da resposta
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, err = w.Write(out)
	if err != nil {
		return err
	}
	return nil
}

// Escreve uma resposta de erro em formato JSON e define o status da resposta
func (app *Handlers) errorJSON(w http.ResponseWriter, err error, status ...int) error {

	// Define o status padrão da resposta para 400 (Bad Request)
	statusCode := http.StatusBadRequest
	if len(status) > 0 {
		statusCode = status[0]
	}

	payload := jsonResponse{
		Error:   true,
		Message: err.Error(),
	}
	return app.writeJSON(w, statusCode, payload)
}
