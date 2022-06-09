// react
import { useEffect, useState } from "react"

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

  useEffect(() => {
    // if auth is ok and no sio -> connect
    if (!loading && user.connected && !sio) {
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
  }, [loading, user])
  return { connected, sio }
}



export default useSio