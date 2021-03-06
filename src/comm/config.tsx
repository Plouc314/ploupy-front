export const VERSION = "0.1.0"

export const FLAG_DEPLOY: boolean = true

export const URL_API: string = FLAG_DEPLOY ?
  "https://ploupy.herokuapp.com/api/"
  : "http://127.0.0.1:5000/api/"

export const URL_SIO: string = FLAG_DEPLOY ?
  "https://ploupy-socketio.herokuapp.com"
  : "http://127.0.0.1:8000"