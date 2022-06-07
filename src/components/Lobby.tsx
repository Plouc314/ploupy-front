// next
import { useRouter } from 'next/router'

// react
import { useState, useEffect, useRef } from 'react'

// types
import { FC, IComm, IModel } from '../../types'

// mui
import {
  Avatar,
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'

// hooks
import { useComm } from '../hooks/useComm'
import { useGameData } from '../hooks/useGameData'
import useSingleEffect from '../hooks/useSingleEffect'

// utils
import { useAuth } from '../utils/Firebase'

// pixi
import Textures from '../pixi/textures'


export interface LobbyProps {

}

const Lobby: FC<LobbyProps> = (props) => {

  const router = useRouter()
  const comm = useComm()
  const { user } = useAuth()
  const { gameData, setGameData } = useGameData()
  const [nPlayer, setNPlayer] = useState(2)

  // ref of list of queues -> cause of callback hell
  const refQueues = useRef<IModel.Queue[]>([])
  const [queues, setQueues] = useState<IModel.Queue[]>([])

  // list of all ids of queues where the user is currently in
  const [activeQueueIds, setActiveQueueIds] = useState<string[]>([])

  const onQueueState = (data: IComm.QueueStateResponse) => {

    for (const queue of data.queues) {
      // check if queue exists
      const idx = refQueues.current.findIndex(q => q.qid === queue.qid)
      if (idx == -1) {
        // add it
        refQueues.current.push(queue)
      } else {
        // update players in queue
        refQueues.current[idx] = queue
      }
      refQueues.current = refQueues.current.filter(q => q.active && q.users.length > 0)
    }

    // update active queue ids
    setActiveQueueIds(refQueues.current
      .filter(q => q.users.find(u => u.username === user.username))
      .map(q => q.qid)
    )

    setQueues([...refQueues.current])
  }

  useSingleEffect(() => {
    if (!comm) return

    comm.setOnStartGame((gameState) => {
      setGameData(gameState)
      router.push("/game")
    })
    comm.setOnQueueState((data) => onQueueState(data))

    comm.refreshQueueState()
  })

  return (
    <Stack
      divider={<Divider />}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          width: "auto",
          padding: 1,
        }}
      >
        <Typography variant="h3">
          Lobby
        </Typography>
        <TextField
          id="n-player"
          variant="standard"
          type="number"
          label="# players"
          margin="dense"
          size="small"
          inputProps={{
            min: 2,
            max: 6,
          }}
          value={nPlayer}
          onChange={(e) => {
            setNPlayer(Math.max(Math.min(Number(e.target.value), 6), 2))
          }}
        />
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            if (!comm) return
            comm.sendActionCreateQueue({ n_player: nPlayer })
          }}
        >
          Create
        </Button>
      </Stack>
      {queues.map(queue => (
        <Stack
          key={queue.qid}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            width: "auto",
            padding: 1,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
          >
            <Typography
              sx={{
                display: "inline",
                fontWeight: "bold",
                marginRight: 5,
              }}
            >
              {`${queue.users.length} / ${queue.n_player}`}
            </Typography>

            {queue.users.map((user) => (
              <Tooltip
                key={`${queue.qid}-${user.uid}`}
                title={user.username}
              >
                <Avatar
                  src={Textures.getAvatarURL(user.avatar)}
                />
              </Tooltip>
            ))}
          </Stack>

          <Button
            variant="contained"
            size="small"
            color={activeQueueIds.includes(queue.qid) ? "secondary" : "primary"}
            onClick={() => {
              if (!comm) return
              if (activeQueueIds.includes(queue.qid)) {
                comm.sendActionLeaveQueue({ qid: queue.qid })
              } else {
                comm.sendActionJoinQueue({ qid: queue.qid })
              }
            }}
          >
            {activeQueueIds.includes(queue.qid) ? "Leave" : "Join"}
          </Button>
        </Stack>
      ))}
      <div /> {/* footer -> to display a divider at the bottom*/}
    </Stack>
  )
}

export default Lobby