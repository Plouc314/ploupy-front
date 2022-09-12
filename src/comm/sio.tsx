// react
import { useEffect, useRef, useState } from "react"

// socket io
import { io, Socket } from "socket.io-client"
import { useAuth } from "../utils/Firebase"

// comm
import { URL_SIO } from './config'

/**
 * Socket io hook
 */
function useSio() {

  const [sio, setSio] = useState<Socket | null>(null)

  const { user } = useAuth()

  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // if loading or sio already setup -> break
    if (sio) return

    let headers: Record<string, string> = {}
    if (user.connected) {
      headers = { "firebase-jwt": user.jwt }
    } else {
      headers = {}
    }

    const _sio = io(URL_SIO, {
      transportOptions: {
        polling: {
          extraHeaders: headers
        }
      }
    })
    _sio.on("connect", () => {
      console.log("connected")
      setConnected(true)
    })

    _sio.on("disconnect", () => {
      console.log("disconnected")
      setConnected(false)
    })
    setSio(_sio)

  }, [user, sio])

  return { connected, sio }
}



export default useSio