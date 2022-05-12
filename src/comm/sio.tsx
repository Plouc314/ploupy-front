// react
import { useState } from "react"

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
  const { loading, user } = useAuth()
  const [connected, setConnected] = useState(false)

  // if auth is ok and no sio -> connect
  if (!loading && user && !sio) {
    const _sio = io(URL_SIO, {
      transportOptions: {
        polling: {
          extraHeaders: {
            'uid': user.uid
          }
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
  }

  return { connected, sio }
}



export default useSio