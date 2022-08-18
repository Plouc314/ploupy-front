// react
import { createContext, useContext, useEffect, useRef, useState } from "react";

// types
import { FC, IComm, ICore } from "../../types";

// comm
import Comm from "../comm/comm";
import useSio from "../comm/sio";

// hooks
import useSingleEffect from "./useSingleEffect";


function useCommInternal(): Comm | null {
  const [comm, setComm] = useState<Comm | null>(null)
  const { connected, sio } = useSio()

  useEffect(() => {
    // handle case sio disconnect
    if (!sio && comm) {
      setComm(null)
    }

    if (connected && sio && !comm) {
      setComm(new Comm(sio))
    }
  }, [connected, sio, comm])

  return comm
}

export function useUsersInternal(comm: Comm | null): ICore.User[] {

  const [isSetup, setIsSetup] = useState(false)

  // ref of list of users -> cause of callback hell
  const refUsers = useRef<ICore.ManUser[]>([])
  const [users, setUsers] = useState<ICore.ManUser[]>([])

  const onUserManagerState = (data: IComm.UserManagerState) => {

    for (const user of data.users) {
      // check if user exists
      const idx = refUsers.current.findIndex(u => u.user.uid === user.user.uid)
      if (idx == -1) {
        // add it
        refUsers.current.push(user)
      } else {
        // update players in user
        refUsers.current[idx] = user
      }
      refUsers.current = refUsers.current.filter(u => u.connected)
    }

    setUsers([...refUsers.current])
  }

  useEffect(() => {
    if (!comm || isSetup) return
    setIsSetup(true)

    comm.setOnUserManagerState((data) => onUserManagerState(data))

    comm.refreshUserManager()
  }, [comm])

  return users.map(u => u.user)
}


const commContext = createContext<{ comm: Comm | null, users: ICore.User[] }>({
  comm: null,
  users: [],
})

export interface CommProviderProps { }

export const CommProvider: FC<CommProviderProps> = (props) => {
  const comm = useCommInternal()
  const users = useUsersInternal(comm)
  return <commContext.Provider
    value={{
      comm,
      users,
    }}
  >
    {props.children}
  </commContext.Provider>
}

/**
 * Return the Comm object
 * automatically try to connecte to socket-io
 */
export function useComm() {
  return useContext(commContext).comm
}

/**
 * Return the currently connected users,
 * as of the user manager
 */
export function useUsers() {
  return useContext(commContext).users
}
