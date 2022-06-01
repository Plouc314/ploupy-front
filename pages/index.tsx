// next
import { useRouter } from 'next/router'

// react
import { useState, useEffect, useRef } from 'react'

// types
import { FC, IModel } from '../types'

// mui
import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'

// firebase
import { signOut } from "firebase/auth"

// components
import Page from '../src/components/Page'

// hooks
import { useToast } from '../src/hooks/useToast'

// utils
import { auth, useAuth } from '../src/utils/Firebase'

// pixi
import useSio from '../src/comm/sio'
import Pixi from '../src/pixi/pixi'
import Comm from '../src/pixi/comm'
import Game from '../src/pixi/game'
import { COLORS } from '../src/pixi/constants'


export interface PageHomeProps { }


const PageHome: FC<PageHomeProps> = (props) => {

  const router = useRouter()
  const { generateToast } = useToast()
  const { user } = useAuth()
  const { connected, sio } = useSio()
  const [comm, setComm] = useState<Comm | null>(null)
  const [game, setGame] = useState<Game | null>(null)
  const [nPlayer, setNPlayer] = useState(2)
  const refQueues = useRef<IModel.Queue[]>([])
  const [queues, setQueues] = useState<IModel.Queue[]>([])

  // list of all ids of queues where the user is currently in
  const [activeQueueIds, setActiveQueueIds] = useState<string[]>([])

  const onQueueState = (queue: IModel.Queue) => {

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

    // update active queue ids
    setActiveQueueIds(refQueues.current
      .filter(q => q.users.includes(user.username))
      .map(q => q.qid)
    )

    setQueues([...refQueues.current])
  }

  useEffect(() => {
    if (connected && sio) {
      const _comm = new Comm(sio)
      _comm.setOnStartGame((gameState) => {
        const canvas = document.getElementById("PixiCanvas") as HTMLCanvasElement
        const pixi = new Pixi(canvas)
        pixi.textures.load(() => {
          setGame(new Game(pixi, _comm, user, gameState))
        })
      })
      _comm.setOnQueueState((queue) => onQueueState(queue))
      setComm(_comm)
    }
  }, [connected])

  return (
    <Page
      withAuth
      title='Home'
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Ploupy
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              signOut(auth)
                .then(() => {
                  router.replace("/login")
                })
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Paper sx={{ margin: 2, padding: 2 }}>
        <Typography>
          {"This site is in so early development I don't know what it's going to look like. \n Come back someday, maybe."}
        </Typography>
        <Grid
          alignItems="center"
        >
          <TextField
            id="n-player"
            variant="standard"
            type="number"
            value={nPlayer}
            onChange={(e) => { setNPlayer(Number(e.target.value)) }}
          />
          <Button
            onClick={() => {
              if (!comm) {
                generateToast("Not connected", "error")
                return
              }
              comm.sendActionCreateQueue({ n_player: nPlayer })
            }}
          >
            Create game
          </Button>
        </Grid>
      </Paper>
      {queues.map(queue => (
        <Card key={queue.qid}>
          <CardContent>
            <Typography
              variant="subtitle1"
            >
              {`Basic game ${queue.users.length} / ${queue.n_player}`}
            </Typography>
            {queue.users.join(", ")}
          </CardContent>
          <CardActions>
            <Button
              onClick={() => {
                if (!comm) {
                  generateToast("Not connected", "error")
                  return
                }
                if (activeQueueIds.includes(queue.qid)) {
                  comm.sendActionLeaveQueue({ qid: queue.qid })
                } else {
                  comm.sendActionJoinQueue({ qid: queue.qid })
                }
              }}
            >
              {activeQueueIds.includes(queue.qid) ? "Leave" : "Join"}
            </Button>
          </CardActions>
        </Card>
      ))}
      <canvas id="PixiCanvas" />
    </Page >
  )
}

export default PageHome
