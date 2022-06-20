// next
import { useRouter } from 'next/router'

// react
import { useState, useEffect, useRef } from 'react'

// types
import { FC, IComm, ICore } from '../../types'

// mui
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
  Typography
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';

// hooks
import { useComm } from '../hooks/useComm'
import { useGameData } from '../hooks/useGameData'
import useSingleEffect from '../hooks/useSingleEffect'
import { useSnackbar } from 'notistack';

// utils
import { useAuth } from '../utils/Firebase'
import { getModeName } from '../utils/prettyprint';

// pixi
import Textures from '../pixi/textures'
import API from '../comm/api'



interface GameRowProps {
  game: ICore.ManGame
  mode: ICore.GameMode
}

const GameRow: FC<GameRowProps> = (props) => {

  const { enqueueSnackbar } = useSnackbar()

  return (
    <ListItem
      secondaryAction={
        <Tooltip title="View game">
          <IconButton
            onClick={() => enqueueSnackbar("Not implemented.", { variant: "error" })}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      }
      sx={{ pt: 0.5, pb: 0.5 }}
    >
      <ListItemText
        primary={getModeName(props.mode, { skipNPlayers: true })}
        sx={{ flexGrow: 0, pr: 2 }}
      />
      <Stack direction="row">
        {props.game.users.map(u => (
          <Tooltip
            key={"avatar-" + u.uid}
            title={u.username}
          >
            <Avatar
              src={Textures.getAvatarURL(u.avatar)}
              sx={{ width: 30, height: 30 }}
            />
          </Tooltip>
        ))}
      </Stack>
    </ListItem>
  )
}


export interface GamesListProps {

}

const GamesList: FC<GamesListProps> = (props) => {

  const router = useRouter()
  const comm = useComm()

  const [gameModes, setGameModes] = useState<ICore.GameMode[]>([])

  // ref of list of games -> cause of callback hell
  const refGames = useRef<ICore.ManGame[]>([])
  const [games, setGames] = useState<ICore.ManGame[]>([])

  const onGameManagerState = (data: IComm.GameManagerState) => {

    for (const game of data.games) {
      // check if game exists
      const idx = refGames.current.findIndex(g => g.gid === game.gid)
      if (idx == -1) {
        // add it
        refGames.current.push(game)
      } else {
        // update players in game
        refGames.current[idx] = game
      }
      refGames.current = refGames.current.filter(g => g.active)
    }

    setGames([...refGames.current])
  }

  useSingleEffect(() => {
    API.getGameModes()
      .then((data) => {
        if (!data) {
          throw new Error("No game modes received")
        }
        setGameModes(data)
      })
  })

  useSingleEffect(() => {
    if (!comm) return

    comm.setOnGameManagerState((data) => onGameManagerState(data))

    comm.refreshGameManager()
  })

  return (
    <Paper sx={{ m: 2 }}>
      <Typography sx={{ p: 1 }} fontWeight="bold">
        Online games
      </Typography>
      <List>
        {games.map(g => {
          const mode = gameModes?.find(gm => gm.id === g.gmid)
          if (!mode) return <></>
          return (
            <GameRow
              key={"row-" + g.gid}
              game={g}
              mode={mode}
            />
          )
        })}
      </List>
    </Paper>
  )
}

export default GamesList