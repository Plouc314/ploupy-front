// next
import { useRouter } from 'next/router'

// react
import { useState, useEffect, useRef } from 'react'

// types
import { FC, IComm, IModel } from '../types'

// mui
import {
  AppBar,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
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
import Pixi from '../src/pixi/pixi'
import Game from '../src/pixi/game'
import { useComm } from '../src/hooks/useComm'
import { useGameData } from '../src/hooks/useGameData'
import Textures from '../src/pixi/textures'
import MenuBar from '../src/components/MenuBar'


export interface PageGameProps { }


const PageGame: FC<PageGameProps> = (props) => {

  const router = useRouter()
  const comm = useComm()
  const { user } = useAuth()
  const { gameData, setGameData } = useGameData()

  const isGame = useRef(false)
  const [game, setGame] = useState<Game | null>(null)
  const refGame = useRef<Game | null>(null)

  const [hasResigned, setHasResigned] = useState(false)
  const [result, setResult] = useState<IComm.GameResultResponse | null>(null)

  const refCanvasParent = useRef<HTMLDivElement>(null)
  const [resizeObserver, setResizeObserver] = useState<ResizeObserver | null>(null)

  useEffect(() => {
    if (!comm) return
    if (isGame.current) return
    if (!gameData) {
      // no game -> back to main
      router.replace("/")
      return
    }

    isGame.current = true
    setHasResigned(false)

    const canvas = document.getElementById("PixiCanvas") as HTMLCanvasElement
    const pixi = new Pixi(canvas)

    pixi.textures.load(() => {
      refGame.current = new Game(pixi, comm, user, gameData)
      setGame(refGame.current)
    })
  }, [comm, gameData])

  useEffect(() => {
    if (!comm) return
    comm.setOnGameResult((data) => {
      setGameData(null)
      setResult(data)
    })
  }, [comm])

  useEffect(() => {
    if (!refCanvasParent.current) {
      return
    }
    if (resizeObserver) return
    const observer = new ResizeObserver(() => {
      if (!refGame.current) return
      refGame.current.pixi.resize()
    })
    observer.observe(refCanvasParent.current)
    setResizeObserver(observer)
  }, [refCanvasParent.current])

  const goHome = () => {
    isGame.current = false
    router.replace("/")
  }

  return (
    <Page
      withAuth
      withComm
      title='Game'
    >
      <MenuBar compact />
      <Paper
        variant="outlined"
        sx={{ p: 1 }}
      >
        <Stack
          direction="row"
          justifyContent="center"
        >
          <Button
            variant="contained"
            size="small"
            color="error"
            disabled={hasResigned}
            onClick={() => {
              setHasResigned(true)
              comm?.sendActionResignGame({})
            }}
          >
            Resign
          </Button>
        </Stack>
      </Paper>
      <div
        ref={refCanvasParent}
        style={{
          resize: "both",
          overflow: "hidden",
          height: "75vh",
        }}
      >
        <canvas id="PixiCanvas" />
      </div>
      <Dialog
        open={!!result}
      >
        <DialogTitle>
          Game Result
        </DialogTitle>
        <DialogContent>
          <List>
            {result?.ranking.map((user, i) => (
              <ListItem key={`game-rank-${i}`}>
                <ListItemAvatar>
                  <Avatar src={Textures.getAvatarURL(user.avatar)} />
                </ListItemAvatar>
                <ListItemText>
                  {user.username}
                </ListItemText>
                <Typography
                  sx={{
                    marginLeft: 15,
                    fontWeight: "bold",
                  }}
                >
                  {i + 1}
                </Typography>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={goHome}
          >
            Home
          </Button>
        </DialogActions>
      </Dialog>
    </Page >
  )
}

export default PageGame
