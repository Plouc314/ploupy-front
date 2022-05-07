// socket io
import { io, Socket } from "socket.io-client"

// comm
import User from "./user"

class Sio {

  public static sio: Socket
  public static connected: boolean = false

  public static connect() {

    // don't do anything in case of existing connection
    if (this.sio) {
      return
    }
    this.sio = io("http://127.0.0.1:8000", {
      transportOptions: {
        polling: {
          extraHeaders: {
            'uid': User.uid
          }
        }
      }
    })

    this.sio.on("connect", () => {
      console.log("connected")
      this.connected = true
    })

    this.sio.on("disconnect", () => {
      console.log("disconnected")
      this.connected = false
    })
  }

}

export default Sio