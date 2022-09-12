// react
import { createContext, useContext, useEffect, useRef, useState } from "react";

// types
import { FC, IComm, ICore } from "../../types";

// comm
import Comm from "../comm/comm";
import useSio from "../comm/sio";

// hooks
import { useSnackbar } from 'notistack';


function useCommInternal(): Comm | null {
  const [comm, setComm] = useState<Comm | null>(null)
  const { enqueueSnackbar } = useSnackbar()
  const { connected, sio } = useSio()

  useEffect(() => {
    // handle case sio disconnect
    if (!sio && comm) {
      setComm(null)
    }

    if (connected && sio && !comm) {
      const _comm = new Comm(sio)
      _comm.setOnGeneralActionError((msg) => {
        enqueueSnackbar(msg, { variant: "error" })
      })
      setComm(_comm)
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
        // update user
        refUsers.current[idx] = user
      }
    }
    refUsers.current = refUsers.current.filter(u => u.connected)
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

export function useQueuesInternal(comm: Comm | null): ICore.ManQueue[] {

  const [isSetup, setIsSetup] = useState(false)

  // ref of list of queues -> cause of callback hell
  const refQueues = useRef<ICore.ManQueue[]>([])
  const [queues, setQueues] = useState<ICore.ManQueue[]>([])

  const onQueueManagerState = (data: IComm.QueueManagerState) => {

    for (const queue of data.queues) {
      // check if queue exists
      const idx = refQueues.current.findIndex(q => q.qid === queue.qid)
      if (idx == -1) {
        // add it
        refQueues.current.push(queue)
      } else {
        // update queue
        refQueues.current[idx] = queue
      }
    }
    refQueues.current = refQueues.current.filter(q => q.active && q.users.length > 0)
    setQueues([...refQueues.current])
  }

  useEffect(() => {
    if (!comm || isSetup) return
    setIsSetup(true)

    comm.setOnQueueManagerState((data) => onQueueManagerState(data))

    comm.refreshQueueManager()
  }, [comm])

  return queues
}

const commContext = createContext<{ comm: Comm | null, users: ICore.User[], queues: ICore.ManQueue[] }>({
  comm: null,
  users: [],
  queues: [],
})

export interface CommProviderProps { }

export const CommProvider: FC<CommProviderProps> = (props) => {
  const comm = useCommInternal()
  const users = useUsersInternal(comm)
  const queues = useQueuesInternal(comm)
  return <commContext.Provider
    value={{
      comm,
      users,
      queues,
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

/**
 * Return the currently active queues,
 * as of the queue manager
 */
export function useQueues() {
  return useContext(commContext).queues
}