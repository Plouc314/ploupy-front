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

  const [gid, setGid] = useState<string | null>(null)

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
    const gid = router.query.id // don't wait for state update -> shadow state
    setGid(router.query.id)

    comm.setOnGameState((data) => {
      if (isGame.current) return

      // the config is null when the global game state
      // isn't the first state to be received
      if (data.config === null) return

      isGame.current = true
      setHasResigned(false)
      setIsSpectator(!data.players.find(p => p.username === user.username))

      const canvas = document.getElementById("PixiCanvas") as HTMLCanvasElement
      const pixi = new Pixi(canvas)

      pixi.textures.load(() => {
        console.group("create game")
        console.log(data)
        console.groupEnd()
        refGame.current = new Game(gid, pixi, comm, user, data)
        setGame(refGame.current)
      })
    })

    comm.getGameState(
      { gid: gid },
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
      noMaxWidth
      title='Game'
    >
      <MenuBar
        compact
        restricted
        actions={
          !isSpectator ?
            <Button
              variant="contained"
              size="small"
              color="error"
              disabled={hasResigned}
              onClick={() => {
                if (!gid) return
                setHasResigned(true)
                comm?.sendActionResignGame({
                  gid: gid
                })
              }}
              sx={{ mr: 2 }}
            >
              Resign
            </Button>
            : undefined
        }
      />
      <div
        ref={refCanvasParent}
        style={{
          resize: "both",
          overflow: "hidden",
          height: "calc(100vh - 51px)",
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
