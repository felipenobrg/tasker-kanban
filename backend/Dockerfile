# Etapa de construção
FROM golang:alpine AS builder
WORKDIR /app
# Copie apenas os arquivos necessários para a construção
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main .

# Etapa de produção
FROM alpine:latest AS production
WORKDIR /app
COPY --from=builder /app/main .
CMD [ "/app/main" ]