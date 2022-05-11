// next
import { useRouter } from 'next/router'

// react
import { useState, useEffect } from 'react'

// types
import { FC } from '../types'

// mui
import {
  AppBar,
  Button,
  Paper,
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


export interface PageHomeProps { }

const PageHome: FC<PageHomeProps> = (props) => {

  const router = useRouter()
  const { generateToast } = useToast()
  const { user } = useAuth()
  const { connected, sio } = useSio()
  const [comm, setComm] = useState<Comm | null>(null)
  const [game, setGame] = useState<Game | null>(null)

  useEffect(() => {
    if (connected && sio) {
      const _comm = new Comm(sio)
      _comm.setOnStartGame((gameState) => {
        const canvas = document.getElementById("PixiCanvas") as HTMLCanvasElement
        const pixi = new Pixi(canvas)
        setGame(new Game(pixi, _comm, user, gameState))
      })
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
        <Button
          onClick={() => {
            if (!comm) {
              generateToast("Not connected", "error")
              return
            }
            comm.sendJoinGame()
          }}
        >
          play
        </Button>

      </Paper>
      <canvas id="PixiCanvas" />
    </Page>
  )
}

export default PageHome
