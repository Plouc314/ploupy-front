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

  const { loading, user } = useAuth()

  const userConnectedRef = useRef(false)
  const [connected, setConnected] = useState(false)
  const [isVisitor, setIsVisitor] = useState(true)

  useEffect(() => {
    // if loading or sio already setup -> break
    if (loading || sio) return

    userConnectedRef.current = user.connected

    console.group("useEffect 1")
    console.log("current: " + user.connected + " ref: " + userConnectedRef.current)


    let headers: Record<string, string> = {}
    if (user.connected) {
      setIsVisitor(false)
      headers = { "firebase-jwt": user.jwt }
    } else {
      setIsVisitor(true)
      headers = {}
    }
    console.log(headers)
    console.groupEnd()
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

  }, [loading, user, sio])

  useEffect(() => {
    if (loading) return
    if (user.connected == userConnectedRef.current) return

    console.group("useEffect 2")
    console.log("current: " + user.connected + " ref: " + userConnectedRef.current)
    console.groupEnd()

    userConnectedRef.current = user.connected
    if (sio) {
      sio.disconnect()
      setSio(null)
    }
    setConnected(false)

  }, [loading, user, sio])

  return { connected, isVisitor, sio }
}



export default useSio