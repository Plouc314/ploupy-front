// next
import { useRouter } from 'next/router'

// react
import { useState, useEffect, useRef } from 'react'

// types
import { FC, IComm, ICore, IGame } from '../../types'

// mui
import {
  Avatar,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'

// hooks
import { useComm, useQueues } from '../hooks/useComm'
import useSingleEffect from '../hooks/useSingleEffect'
import { useUsers } from '../hooks/useComm';

// utils
import { useAuth } from '../utils/Firebase'

// pixi
import Textures from '../pixi/textures'
import API from '../comm/api'
import { MAP_DIMS } from '../pixi/constants'

// components
import { UserItem } from './UsersList'

interface DialogBotsProps {
  qid: string
  open: boolean
  onClose: () => void
}

const DialogBots: FC<DialogBotsProps> = (props) => {

  const comm = useComm()
  const users = useUsers()

  const onInviteUser = (user: ICore.User) => {
    if (!comm) return
    comm.sendActionSendQueueInvitation({
      qid: props.qid,
      uid: user.uid,
    })
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
    >
      <DialogTitle
        sx={{
          minWidth: "400px"
        }}
      >
        Bots
      </DialogTitle>
      <DialogContent>
        <List>
          {users
            .filter(u => u.is_bot)
            .map(u => (
              <UserItem
                key={u.uid}
                user={u}
                userType="bot"
                onInviteUser={() => onInviteUser(u)}
              />
            ))}
        </List>
        {users.filter(u => u.is_bot).length == 0 &&
          <Typography color="text.secondary">
            There is currently no connected bots...
          </Typography>
        }
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export interface LobbyProps {

}

const Lobby: FC<LobbyProps> = (props) => {

  const router = useRouter()
  const comm = useComm()
  const { user } = useAuth()
  const queues = useQueues()

  const [currentQid, setCurrentQid] = useState("")

  const [gameModes, setGameModes] = useState<ICore.GameMode[]>([])
  const [gameMode, setGameMode] = useState<ICore.GameMode | null>(null)

  // list of all ids of queues where the user is currently in
  const [activeQueueIds, setActiveQueueIds] = useState<string[]>([])

  const [nPlayer, setNPlayer] = useState<number>(2)
  const [dim, setDim] = useState<IGame.MapSize>("medium")

  useEffect(() => {
    // update active queue ids
    setActiveQueueIds(queues
      .filter(q => q.users.find(u => u.username === user.username))
      .map(q => q.qid)
    )
  }, [queues])

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
    // check for active game AFTER having defined onStartGame
    comm.checkActiveGame()
  })

  return (
    <>
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
          {gameMode &&
            <Stack
              direction="row"
              alignItems="center"
            >
              <TextField
                select
                id="select-game-mode"
                variant="standard"
                label="Game Mode"
                margin="dense"
                size="small"
                value={gameMode?.id}
                onChange={(e) => {
                  const gm = gameModes.find(gm => gm.id === e.target.value)
                  if (gm) {
                    setGameMode(gm)
                  }
                }}
                sx={{ mx: 1, minWidth: 100 }}
              >
                {gameModes.map(gm => (
                  <MenuItem key={`gm-${gm.id}`} value={gm.id}>
                    {gm.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                id="select-n-player"
                variant="standard"
                label="# players"
                margin="dense"
                size="small"
                value={nPlayer}
                onChange={(e) => {
                  setNPlayer(Number(e.target.value))
                }}
                sx={{ mx: 1, minWidth: 100 }}
              >
                {[2, 3, 4, 5].map((n) => (
                  <MenuItem key={`nplayer-${n}`} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                id="select-dim"
                variant="standard"
                label="Map size"
                margin="dense"
                size="small"
                value={dim}
                onChange={(e) => {
                  setDim(e.target.value as IGame.MapSize)
                }}
                sx={{ mx: 1, minWidth: 100 }}
              >
                {Object.keys(MAP_DIMS).map((name) => (
                  <MenuItem key={`dim-${name}`} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          }
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              if (!comm) return
              if (!gameMode) return
              comm.sendActionCreateQueue({
                gmid: gameMode.id,
                metadata: {
                  dim: MAP_DIMS[dim],
                  n_player: nPlayer,
                }
              })
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
                {`${queue.users.length} / ${queue.metadata.n_player}`}
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

            <ButtonGroup
              variant="contained"
              size="small"
            >
              {queue.users[0].uid === user.uid &&
                <Button
                  color="primary"
                  onClick={() => {
                    setCurrentQid(queue.qid)
                  }}
                >
                  Add bot
                </Button>
              }
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
            </ButtonGroup>

          </Stack>
        ))}
        <div /> {/* footer -> to display a divider at the bottom*/}
      </Stack>
      <DialogBots
        qid={currentQid}
        open={!!currentQid}
        onClose={() => setCurrentQid("")}
      />
    </>
  )
}

export default Lobby