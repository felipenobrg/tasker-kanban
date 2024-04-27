package handlers

import "net/http"

func Welcome(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("welcome"))
}
