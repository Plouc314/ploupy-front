// next
import { useRouter } from 'next/router'

// react
import { useState, useEffect, useRef } from 'react'

// types
import { FC, IComm, IModel } from '../../types'

// mui
import {
  AppBar,
  Avatar,
  Box,
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
import Page from '../../src/components/Page'

// hooks
import { useComm } from '../../src/hooks/useComm'
import { useGameData } from '../../src/hooks/useGameData'

// utils
import { auth, useAuth } from '../../src/utils/Firebase'

// pixi
import Game from '../../src/pixi/game'
import Textures from '../../src/pixi/textures'
import GameStats from '../../src/components/GameStats'


export interface GameResultsListProps {
  ranking: IComm.GameResultResponse["ranking"]
}

const GameResultsList: FC<GameResultsListProps> = (props) => {
  return (
    <List>
      {props.ranking.map((user, i) => (
        <ListItem key={`game-rank-${i}`}>
          <ListItemAvatar>
            <Avatar
              src={Textures.getAvatarURL(user.avatar)}
              sx={{
                borderWidth: i < 3 ? 3 : 0,
                borderStyle: "solid",
                borderColor: i < 3 ? ["yellow", "gray", "brown"][i] : undefined,
              }}
            />
          </ListItemAvatar>
          <ListItemText>
            {user.username}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  )
}

export interface GameResultsProps {
  result: IComm.GameResultResponse | null
  onBackHome: () => void
}

const GameResults: FC<GameResultsProps> = (props) => {

  const [state, setState] = useState<"ranking" | "stats">("ranking")

  return (
    <Dialog
      open={!!props.result}
      maxWidth={false}
    >
      <DialogTitle >
        Game Result
      </DialogTitle>
      <DialogContent>
        {props.result && state === "ranking" &&
          <GameResultsList ranking={props.result.ranking} />
        }
        {props.result && state === "stats" &&
          <Box sx={{ width: "800px" }}>
            <GameStats data={props.result.stats} />
          </Box>
        }

      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => { setState(state === "ranking" ? "stats" : "ranking") }}
        >
          {state === "ranking" ? "Stats" : "Ranking"}
        </Button>
        <Button
          onClick={props.onBackHome}
        >
          Home
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GameResults
