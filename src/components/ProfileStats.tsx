// react
import { useState, useEffect, useRef } from 'react'

// types
import { FC, IComm, ICore } from '../../types'

// mui
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  Divider,
  Grid,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

// chart js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as TooltipCJS,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// hooks
import useSingleEffect from '../hooks/useSingleEffect'

// utils
import { getModeName } from '../utils/prettyprint';

// pixi
import API from '../comm/api'
import Color from '../utils/color';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  TooltipCJS,
  Legend
);


interface GraphMMRProps {
  stats: ICore.GeneralStats
}

const GraphMMR: FC<GraphMMRProps> = (props) => {
  return (
    <Card sx={{ m: 2 }}>
      <CardHeader
        title="MMR"
      />
      <CardContent>
        <Typography variant="h6" textAlign="center">
          {props.stats.mmr}
        </Typography>
      </CardContent>
    </Card>
  )
}


interface GraphRankingProps {
  stats: ICore.GeneralStats
}

const GraphRanking: FC<GraphRankingProps> = (props) => {

  const colorsSet: Record<number, Color[]> = {
    2: [
      Color.fromRgb(133, 169, 78),
      Color.fromRgb(179, 52, 48),
    ],
    3: [
      Color.fromRgb(133, 169, 78),
      Color.fromRgb(139, 137, 135),
      Color.fromRgb(179, 52, 48),
    ],
    4: [
      Color.fromRgb(133, 169, 78),
      Color.fromRgb(137, 148, 116),
      Color.fromRgb(152, 109, 106),
      Color.fromRgb(179, 52, 48),
    ],
  }

  const getLabel = (i: number) => {
    if (i > 2) { return (i + 1) + "th" }
    return (i + 1) + ["st", "nd", "rd"][i]
  }

  const getBorderRadius = (i: number) => {
    if (i == 0) {
      return { bottomLeft: 50, topLeft: 50 }
    }
    if (i == props.stats.scores.length - 1) {
      return { bottomRight: 50, topRight: 50 }
    }
    return undefined
  }

  const colors = colorsSet[props.stats.mode.config.n_player]

  const totalGames = props.stats.scores.reduce((p, v) => p + v, 0)

  return (
    <Card sx={{ m: 2 }}>
      <CardHeader
        title="Ranking"
        subheader={totalGames + " games"}
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ maxHeight: 80, pt: 0 }}>
        <Bar
          data={{
            labels: [""],
            datasets: props.stats.scores.map((n, i) => ({
              label: getLabel(i),
              data: [n],
              backgroundColor: colors[i].toString(),
              borderRadius: getBorderRadius(i),
              borderSkipped: false,
            })),
          }}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            indexAxis: "y",
            scales: {
              x: {
                stacked: true,
                display: false,
                max: totalGames
              },
              y: {
                stacked: true,
                display: false,
              }
            }
          }}
        />
      </CardContent>
    </Card>
  )
}


export interface ProfileStatsProps {
  uid: string
}

const ProfileStats: FC<ProfileStatsProps> = (props) => {

  const [stats, setStats] = useState<ICore.GeneralStats[] | null>(null)
  const [currentStats, setCurrentStats] = useState<ICore.GeneralStats | null>(null)
  const [modeDialogAnchor, setModeDialogAnchor] = useState<HTMLElement | null>(null)

  useSingleEffect(() => {
    API.getUserStats(props.uid)
      .then((data) => {
        if (!data) {
          throw new Error("No stats received.")
        }
        setStats(data)
        setCurrentStats(data[0])
      })
  })

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ m: 2, mt: 4 }}
      >
        <Tooltip title="Game mode">
          <Typography variant="h3">
            {currentStats && getModeName(currentStats.mode)}
          </Typography>
        </Tooltip>
        <IconButton
          onClick={(e) => setModeDialogAnchor(e.currentTarget)}
        >
          <FormatListBulletedIcon />
        </IconButton>
      </Stack>
      <Divider sx={{ mb: 4 }} />
      {currentStats &&
        <>
          <GraphMMR stats={currentStats} />
          <GraphRanking stats={currentStats} />
        </>
      }
      <Menu
        anchorEl={modeDialogAnchor}
        open={!!modeDialogAnchor}
        onClose={() => setModeDialogAnchor(null)}
      >
        {stats && stats.map((gstats, i) => (
          <MenuItem
            key={"game-mode-item-" + i}
            onClick={() => {
              setCurrentStats(stats[i])
              setModeDialogAnchor(null)
            }}
          >
            {getModeName(gstats.mode)}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default ProfileStats
