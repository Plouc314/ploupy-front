// react
import { useState } from 'react'

// types
import { FC, IComm } from '../../types'

// mui
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material'

// pixi
import Textures from '../../src/pixi/textures'
import GameStats from '../../src/components/GameStats'
import Color from '../utils/color'


export interface GameResultsListProps {
  results: IComm.GameResultResponse
}

const GameResultsList: FC<GameResultsListProps> = (props) => {
  const colors = [
    Color.fromRgb(175, 149, 0),
    Color.fromRgb(180, 180, 180),
    Color.fromRgb(106, 56, 5),
  ]
  return (
    <List>
      {props.results.ranking.map((user, i) => {
        const mmr = props.results.mmrs[i]
        const diff = props.results.mmr_diffs[i]
        return (
          <ListItem key={`game-rank-${i}`}>
            <ListItemAvatar>
              <Avatar
                src={Textures.getAvatarURL(user.avatar)}
                sx={{
                  // borderWidth: i < 3 ? 5 : 0,
                  // borderStyle: "solid",
                  // borderColor: i < 3 ? colors[i].toString() : undefined,
                }}
              />
            </ListItemAvatar>
            <ListItemText sx={{ width: 300 }}>
              {user.username}
            </ListItemText>
            <ListItemText>
              {mmr}
              <Typography
                pl={1}
                display="inline-block"
                color={diff > 0 ? "success.dark" : diff < 0 ? "error.dark" : undefined}
              >
                {`(${diff > 0 ? "+" : ""}${diff})`}
              </Typography>
            </ListItemText>
          </ListItem>
        )
      })}
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
          <GameResultsList results={props.result} />
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
