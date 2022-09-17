export const VERSION = "0.4.3"

export const FLAG_DEPLOY: boolean = true

export const URL_API: string = FLAG_DEPLOY ?
  "https://ploupy-api-production.up.railway.app/api/"
  : "http://127.0.0.1:5000/api/"

export const URL_SIO: string = FLAG_DEPLOY ?
  "https://ploupy-socketio-production.up.railway.app/"
  : "http://127.0.0.1:8000"
