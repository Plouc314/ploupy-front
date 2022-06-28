// next
import { useRouter } from 'next/router'

// react
import { useState, useEffect, useRef } from 'react'

// types
import { FC, IComm, IGame } from '../types'

// mui
import {
  Button,
  Paper,
  Stack,
} from '@mui/material'

// components
import Page from '../src/components/Page'

// hooks
import { useComm } from '../src/hooks/useComm'

// utils
import { useAuth } from '../src/utils/Firebase'

// pixi
import Pixi from '../src/pixi/pixi'
import Game from '../src/pixi/game'
import MenuBar from '../src/components/MenuBar'
import GameResults from '../src/components/GameResults'


export interface PageGameProps { }


const PageGame: FC<PageGameProps> = (props) => {

  const router = useRouter()
  const comm = useComm()
  const { user } = useAuth()


  const isGame = useRef(false)
  const [game, setGame] = useState<Game | null>(null)
  const refGame = useRef<Game | null>(null)

  const [isSpectator, setIsSpectator] = useState(true)
  const [hasResigned, setHasResigned] = useState(false)
  const [result, setResult] = useState<IComm.GameResultResponse | null>(null)

  const refCanvasParent = useRef<HTMLDivElement>(null)
  const [resizeObserver, setResizeObserver] = useState<ResizeObserver | null>(null)

  useEffect(() => {
    if (!comm) return
    if (!router.isReady) return
    if (isGame.current) return

    if (!router.query.id || typeof router.query.id !== "string") {
      router.replace("/")
      return
    }

    comm.setOnGameState((data) => {
      if (isGame.current) return
      isGame.current = true
      setHasResigned(false)
      setIsSpectator(!data.players.find(p => p.username === user.username))

      const canvas = document.getElementById("PixiCanvas") as HTMLCanvasElement
      const pixi = new Pixi(canvas)

      pixi.textures.load(() => {
        console.group("create game")
        console.log(data)
        console.groupEnd()
        refGame.current = new Game(pixi, comm, user, data as IGame.Game)
        setGame(refGame.current)
      })
    })

    comm.getGameState(
      { gid: router.query.id },
      (response) => {
        if (!response.success) {
          router.replace("/")
        }
      })

  }, [comm, router.isReady])

  useEffect(() => {
    if (!comm) return
    comm.setOnGameResult((data) => {
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
    setResizeObserver(null)
    game?.destroy()
    router.replace("/")
  }

  return (
    <Page
      withComm
      title='Game'
    >
      <MenuBar compact restricted />
      <Paper
        variant="outlined"
        sx={{ p: 1 }}
      >
        <Stack
          direction="row"
          justifyContent="center"
        >
          {!isSpectator &&
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
          }
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
      <GameResults
        result={result}
        onBackHome={goHome}
      />
    </Page >
  )
}

export default PageGame
