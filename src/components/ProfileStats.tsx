// react
import { useState, useEffect, useRef } from 'react'

// types
import { FC, IComm, ICore } from '../../types'

// mui
import {
  Box,
  capitalize,
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
  useTheme,
} from '@mui/material'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

// chart js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip as TooltipCJS,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns'

// hooks
import useSingleEffect from '../hooks/useSingleEffect'

// pixi
import API from '../comm/api'
import Color from '../utils/color';



ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  TooltipCJS,
  Legend
);


interface GraphMMRProps {
  user: ICore.User
  stats: ICore.GameModeStats
}

const GraphMMR: FC<GraphMMRProps> = (props) => {

  const theme = useTheme()

  return (
    <Card sx={{ m: 2 }}>
      <CardHeader
        title={(
          <>
            MMR
            <Typography
              variant="h6"
              color="text.sedondary"
              component="span"
              sx={{ pl: 3 }}
            >
              {props.user.mmrs[props.stats.mode.id]}
            </Typography>
          </>
        )
        }
      />
      < CardContent >
        <Line
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
            scales: {
              yAxis: {
                suggestedMin: 0,
              },
              xAxis: {
                type: "time",
              }
            }
          }}
          data={{
            datasets: [{
              label: "MMR",
              data: props.stats.dates.map((d, i) => ({ x: d, y: props.stats.mmr_hist[i] })),
              backgroundColor: theme.palette.primary.dark,
              borderColor: theme.palette.primary.dark,
              showLine: true,
              pointRadius: 3,
            }]
          }}
        />
      </CardContent >
    </Card >
  )
}


interface GraphRankingProps {
  stats: ICore.GameModeStats
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

    const idxStart = props.stats.scores.findIndex(v => v > 0)
    const idxStop = props.stats.scores.length - 1 - props.stats.scores
      .slice()
      .reverse()
      .findIndex(v => v > 0)

    let radius = undefined

    if (i == idxStart) {
      radius = { bottomLeft: 50, topLeft: 50 }
    }
    if (i == idxStop) {
      radius = { ...(radius ?? {}), bottomRight: 50, topRight: 50 }
    }
    return radius
  }
  // @ts-ignore
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
  user: ICore.User
}

const ProfileStats: FC<ProfileStatsProps> = (props) => {

  const [stats, setStats] = useState<ICore.GameModeStats[] | null>(null)
  const [currentStats, setCurrentStats] = useState<ICore.GameModeStats | null>(null)
  const [modeDialogAnchor, setModeDialogAnchor] = useState<HTMLElement | null>(null)

  useSingleEffect(() => {
    API.getUserStats(props.user.uid)
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
            {capitalize(currentStats?.mode.name ?? "")}
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
          <GraphMMR user={props.user} stats={currentStats} />
          {/* Remove grahRanking until update of db
            format to support metadata
          */}
          {/* <GraphRanking stats={currentStats} /> */}
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
            {capitalize(gstats.mode.name)}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default ProfileStats
