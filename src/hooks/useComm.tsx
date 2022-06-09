// react
import { createContext, useContext, useEffect, useState } from "react";

// types
import { FC } from "../../types";

// comm
import Comm from "../comm/comm";
import useSio from "../comm/sio";


function useCommInternal(): Comm | null {
  const [comm, setComm] = useState<Comm | null>(null)
  const { connected, sio } = useSio()

  useEffect(() => {
    if (connected && sio && !comm) {
      setComm(new Comm(sio))
    }
  }, [connected, sio])

  return comm
}

const commContext = createContext<Comm | null>(null)

export interface CommProviderProps { }

export const CommProvider: FC<CommProviderProps> = (props) => {
  const values = useCommInternal()
  return <commContext.Provider value={values}>{props.children}</commContext.Provider>
}

/**
 * Return the Comm object
 * automatically try to connecte to socket-io
 */
export function useComm() {
  return useContext(commContext)
}
