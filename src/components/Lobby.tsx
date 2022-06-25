// next
import { useRouter } from 'next/router'

// react
import { useState, useEffect, useRef } from 'react'

// types
import { FC, IComm, ICore } from '../../types'

// mui
import {
  Avatar,
  Button,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'

// hooks
import { useComm } from '../hooks/useComm'
import useSingleEffect from '../hooks/useSingleEffect'

// utils
import { useAuth } from '../utils/Firebase'

// pixi
import Textures from '../pixi/textures'
import API from '../comm/api'


export interface LobbyProps {

}

const Lobby: FC<LobbyProps> = (props) => {

  const router = useRouter()
  const comm = useComm()
  const { user } = useAuth()

  const [gameModes, setGameModes] = useState<ICore.GameMode[]>([])

  const [gameMode, setGameMode] = useState<ICore.GameMode | null>(null)

  // ref of list of queues -> cause of callback hell
  const refQueues = useRef<ICore.ManQueue[]>([])
  const [queues, setQueues] = useState<ICore.ManQueue[]>([])

  // list of all ids of queues where the user is currently in
  const [activeQueueIds, setActiveQueueIds] = useState<string[]>([])

  const onQueueState = (data: IComm.QueueManagerState) => {

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

  const getQueueGameMode = (queue: ICore.ManQueue) => {
    return gameModes.find(gm => gm.id === queue.gmid)
  }

  useSingleEffect(() => {
    API.getGameModes()
      .then((data) => {
        if (!data) {
          throw new Error("No game modes received")
        }
        setGameModes(data)
        setGameMode(data[0])
      })
  })

  useSingleEffect(() => {
    if (!comm) return

    comm.setOnStartGame((data) => {
      router.push(`/game?id=${data.gid}`)
    })
    comm.setOnQueueManagerState((data) => onQueueState(data))

    comm.refreshQueueManager()

    // check for active game AFTER having defined onStartGame
    comm.checkActiveGame()
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
          select
          id="n-player"
          variant="standard"
          label="# players"
          margin="dense"
          size="small"
          helperText="Players in the game"
          value={gameMode?.id ?? "null"}
          onChange={(e) => {
            const gm = gameModes.find(gm => gm.id === e.target.value)
            if (!gm) return
            setGameMode(gm)
          }}
        >
          {gameModes.length == 0 ?
            <MenuItem key="nplayer-null" value="null">
              {""}
            </MenuItem>
            : gameModes.map((gm) => (
              <MenuItem key={gm.id} value={gm.id}>
                {gm.config.n_player}
              </MenuItem>
            ))}
        </TextField>
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            if (!comm) return
            if (!gameMode) return
            comm.sendActionCreateQueue({ gmid: gameMode.id })
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
              {`${queue.users.length} / ${getQueueGameMode(queue)?.config.n_player ?? "??"}`}
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